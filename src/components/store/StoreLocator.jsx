import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X, Navigation, Phone, Clock, Loader2 } from "lucide-react";
import { storeService } from "../../services/api";

export default function StoreLocator({ isOpen, onClose, productName = "this product", productId = null }) {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [locationError, setLocationError] = useState("");
    const [userLocation, setUserLocation] = useState(null);
    const [searchRadius, setSearchRadius] = useState(25);

    useEffect(() => {
        if (isOpen) {
            getUserLocation();
        }
    }, [isOpen]);

    const getUserLocation = () => {
        setLocationError("");
        setError("");

        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by your browser");
            return;
        }

        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ lat: latitude, lng: longitude });
                await fetchNearbyStores(latitude, longitude);
            },
            (error) => {
                setLoading(false);
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setLocationError("Please allow location access to find nearby stores");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        setLocationError("Location information is unavailable");
                        break;
                    case error.TIMEOUT:
                        setLocationError("Location request timed out");
                        break;
                    default:
                        setLocationError("An unknown error occurred");
                }
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const fetchNearbyStores = async (lat, lng) => {
        setLoading(true);
        setError("");

        try {
            // Use product-filtered API if productId is provided
            const response = productId
                ? await storeService.getNearbyStoresByProduct(lat, lng, productId, searchRadius)
                : await storeService.getNearbyStores(lat, lng, searchRadius);

            setStores(response.data || []);

            if (response.data?.length === 0) {
                setError(productId
                    ? `No stores carrying this product found within ${searchRadius}km`
                    : `No stores found within ${searchRadius}km of your location`
                );
            }
        } catch (err) {
            console.error("Error fetching stores:", err);
            setError("Unable to fetch nearby stores. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleRetry = () => {
        if (userLocation) {
            fetchNearbyStores(userLocation.lat, userLocation.lng);
        } else {
            getUserLocation();
        }
    };

    const openInMaps = (store) => {
        const [lng, lat] = store.location.coordinates;
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        window.open(url, "_blank");
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ duration: 0.25 }}
                    className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-black text-white p-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5" />
                            <div>
                                <h2 className="text-lg font-semibold">Find Nearby Stores</h2>
                                <p className="text-xs text-white/70">Purchase {productName} at a store near you</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-full transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-5">
                        {/* Location Error */}
                        {locationError && (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MapPin className="w-8 h-8 text-red-500" />
                                </div>
                                <p className="text-red-600 mb-4">{locationError}</p>
                                <button
                                    onClick={getUserLocation}
                                    className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}

                        {/* Loading */}
                        {loading && !locationError && (
                            <div className="text-center py-12">
                                <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-black" />
                                <p className="text-gray-600">Finding stores near you...</p>
                            </div>
                        )}

                        {/* Error */}
                        {error && !loading && !locationError && (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MapPin className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="text-gray-600 mb-4">{error}</p>
                                <div className="flex gap-2 justify-center">
                                    <select
                                        value={searchRadius}
                                        onChange={(e) => setSearchRadius(Number(e.target.value))}
                                        className="border rounded-lg px-3 py-2 text-sm"
                                    >
                                        <option value={5}>5 km</option>
                                        <option value={10}>10 km</option>
                                        <option value={25}>25 km</option>
                                        <option value={50}>50 km</option>
                                    </select>
                                    <button
                                        onClick={handleRetry}
                                        className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
                                    >
                                        Search Again
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Stores List */}
                        {!loading && !error && !locationError && stores.length > 0 && (
                            <div className="space-y-4">
                                <p className="text-sm text-gray-500 mb-4">
                                    Found {stores.length} store{stores.length > 1 ? "s" : ""} near you
                                </p>

                                {stores.map((store) => (
                                    <motion.div
                                        key={store._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="border border-gray-200 rounded-xl p-4 hover:border-black transition"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg">{store.name}</h3>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {store.fullAddress || `${store.address.street}, ${store.address.city}`}
                                                </p>

                                                {store.distance && (
                                                    <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                                                        <Navigation className="w-4 h-4" />
                                                        <span>{store.distance} {store.distanceUnit || 'km'} away</span>
                                                    </div>
                                                )}

                                                <div className="flex flex-wrap gap-3 mt-3">
                                                    {store.phone && (
                                                        <a
                                                            href={`tel:${store.phone}`}
                                                            className="flex items-center gap-1 text-sm text-gray-600 hover:text-black"
                                                        >
                                                            <Phone className="w-4 h-4" />
                                                            {store.phone}
                                                        </a>
                                                    )}
                                                    {store.storeType && (
                                                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full capitalize">
                                                            {store.storeType}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => openInMaps(store)}
                                                className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition flex items-center gap-2"
                                            >
                                                <Navigation className="w-4 h-4" />
                                                Directions
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t p-4 bg-gray-50">
                        <p className="text-xs text-center text-gray-500">
                            Store availability may vary. Please call ahead to confirm.
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
