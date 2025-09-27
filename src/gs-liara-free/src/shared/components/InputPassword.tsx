import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const InputPassword = (
  props: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
) => {
  const [isVisible, setIsVisible] = useState(false);

  const makeItText = () => setIsVisible(true);
  const makeItPassword = () => setIsVisible(false);

  return (
    <div className="input-group">
      <input type={isVisible ? "text" : "password"} {...props} />{" "}
      <button
        type="button"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          makeItText();
        }}
        onPointerUp={(e) => {
          makeItPassword();
          e.currentTarget.releasePointerCapture(e.pointerId);
          e.currentTarget.blur();
        }}
        onKeyDown={(e) => (e.code === "Space" ? makeItText() : undefined)}
        onKeyUp={(e) => (e.code === "Space" ? makeItPassword() : undefined)}
      >
        <FontAwesomeIcon icon={faEye} />
      </button>
    </div>
  );
};

export default InputPassword;
