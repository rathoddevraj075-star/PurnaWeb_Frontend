import React from "react";
import {
  FaYoutube,
  FaTiktok,
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#1F4D2B] text-white px-6 py-13">
      {/* Navigation Links */}
      {/* <div className="text-center mb-8">
        <nav className="flex flex-wrap justify-center gap-8 text-sm">
          <a href="/" className="hover:underline">Home</a>
          <a href="/about" className="hover:underline">About Us</a>
          <a href="/products" className="hover:underline">Products</a>
          <a href="/journal" className="hover:underline">Journal</a>
          <a href="/contact" className="hover:underline">Contact</a>
        </nav>
      </div> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
        {/* COLLECTIONS */}
        <div>
          <h3 className="mb-3 text-lg">COLLECTIONS</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/collections/oral-care/immersive" className="hover:underline">
                Oral Care
              </a>
            </li>
            <li>
              <a href="/collections/skin-care/immersive" className="hover:underline">
                Skin Care
              </a>
            </li>
            <li>
              <a href="/collections/body-care/immersive" className="hover:underline">
                Body Care
              </a>
            </li>
            <li>
              <a href="/collections/hair-care/immersive" className="hover:underline">
                Hair Care
              </a>
            </li>
          </ul>
        </div>

        {/* INFO */}
        <div>
          <h3 className="mb-3 text-lg">INFO</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/faq" className="hover:underline">
                FAQ
              </a>
            </li>
            <li>
              <a href="/about" className="hover:underline">
                About Us
              </a>
            </li>
            <li>
              <a href="/routine" className="hover:underline">
                PurnaRoutine
              </a>
            </li>
            <li>
              <a href="/science" className="hover:underline">
                Our Mission
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* SOCIAL */}
        <div>
          <h3 className="mb-3 text-lg">SOCIAL</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <a href="#" className="flex items-center gap-2 hover:underline">
                <FaYoutube /> Youtube
              </a>
            </li>
            <li className="flex items-center gap-2">
              <a href="#" className="flex items-center gap-2 hover:underline">
                <FaTiktok /> TikTok
              </a>
            </li>
            <li className="flex items-center gap-2">
              <a href="#" className="flex items-center gap-2 hover:underline">
                <FaFacebookF /> Facebook
              </a>
            </li>
            <li className="flex items-center gap-2">
              <a href="#" className="flex items-center gap-2 hover:underline">
                <FaInstagram /> Instagram
              </a>
            </li>
          </ul>
        </div>

        {/* ABOUT */}
        <div>
          <h3 className="mb-4 text-lg">ABOUT PURNAROUTINE</h3>
          <p className="text-sm leading-relaxed">
            PurnaRoutine offers complete daily wellness from morning to night. Ayurvedic-inspired essentials for your everyday routine.
          </p>
        </div>
      </div>



      {/* Divider */}
      <div className="border-t border-gray-700 my-8"></div>

      {/* Bottom Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* <div className="flex gap-6 text-sm">
          <span>PL / USD ⌄</span>
          <span>EN ⌄</span>
        </div> */}

        {/* <div className="flex flex-wrap justify-center gap-3">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/d/d1/RuPay.svg"
            alt="RuPay"
            className="h-6 w-16 bg-white p-1 rounded object-contain"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
            alt="Visa"
            className="h-6 w-16 bg-white p-1 rounded object-contain"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
            alt="Mastercard"
            className="h-6 w-16 bg-white p-1 rounded object-contain"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg"
            alt="UPI"
            className="h-6 w-16 bg-white p-1 rounded object-contain"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg"
            alt="Google Pay"
            className="h-6 w-16 bg-white p-1 rounded object-contain"
          />
        </div> */}
      </div>

      {/* Large Text */}
      <div className="mt-6 text-center tracking-tight opacity-50 select-none cursor-default">
        <span className="text-[var(--color-orange)] text-[15vw] sm:text-[15vw] md:text-[15vw] lg:text-[18vw] xl:text-[20vw] leading-none">
          Purna
        </span>
      </div>
    </footer>
  );
};

export default Footer;
