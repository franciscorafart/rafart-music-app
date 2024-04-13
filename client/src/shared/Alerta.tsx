import { useEffect } from "react";
import { Alert } from "react-bootstrap";
import { useRecoilState } from "recoil";
import alert, { defaultAlert } from "atoms/alert";
import { useIsMounted } from "utils/hooks/useIsMounted";

const Alerta = () => {
  const [alerta, setAlert] = useRecoilState(alert);
  const isMounted = useIsMounted();

  useEffect(() => {
    const dismiss = async () => {
      setTimeout(() => {
        if (isMounted()) {
          setAlert(defaultAlert);
        }
      }, 6000);
    };

    if (alerta.display) {
      dismiss();
    }
  }, [alerta.display, isMounted, setAlert]);

  if (!alerta.display) return null;

  return (
    <Alert
      variant={alerta.variant}
      dismissible
      transition
      onClose={() =>
        setAlert({ display: false, variant: "success", message: "" })
      }
    >
      <Alert.Heading></Alert.Heading>
      <p>{alerta.message}</p>
    </Alert>
  );
};

export default Alerta;
