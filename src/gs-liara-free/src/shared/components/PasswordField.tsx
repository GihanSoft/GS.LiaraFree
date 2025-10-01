import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField, {
  type TextFieldProps,
  type TextFieldVariants,
} from "@mui/material/TextField";
import { useState } from "react";

const PasswordField = <Variant extends TextFieldVariants>(
  props: {
    variant?: Variant;
  } & Omit<TextFieldProps, "variant">
) => {
  const [isVisible, setIsVisible] = useState(false);

  const makeItText = () => setIsVisible(true);
  const makeItPassword = () => setIsVisible(false);

  return (
    <TextField
      type={isVisible ? "text" : "password"}
      {...props}
      {...props}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  makeItText();
                }}
                onPointerUp={(e) => {
                  makeItPassword();
                  e.currentTarget.releasePointerCapture(e.pointerId);
                  e.currentTarget.blur();
                }}
                onKeyDown={(e) =>
                  e.code === "Space" ? makeItText() : undefined
                }
                onKeyUp={(e) =>
                  e.code === "Space" ? makeItPassword() : undefined
                }
              >
                <FontAwesomeIcon icon={faEye} size="xs" />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

export default PasswordField;
