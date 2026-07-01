const Buttons = ({
  disabled = false,
  children,
  className = "",
  onClickhandler,
  type = "button",
}) => {
  return (
    <button
      disabled={disabled}
      type={type}
      className={className}
      onClick={onClickhandler}
    >
      {children}
    </button>
  );
};

export default Buttons;