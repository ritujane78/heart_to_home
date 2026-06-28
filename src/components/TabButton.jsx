import { useEffect } from "react";

function TabButton({ icon, label, active, onClick }) {
  useEffect(() => {
      window.scrollTo({
      top: 0,
      behavior: "smooth", // or "auto"
    });
    }, [active])
  return (
    <button className={`tab ${active ? 'active' : ''}`} type="button" onClick={onClick}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

export default TabButton;
