export default function Container({ className = "", children }) {
    return <div className={`container max-w-7xl ${className}`}>{children}</div>;
  }
  