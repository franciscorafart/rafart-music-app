import { ReactNode, useCallback, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import accountInState from "atoms/account";
import { getAuthUser } from "requests/auth";
import { Roles } from "utils/enums";
import { useNavigate } from "react-router-dom";
import userRoute from "atoms/userRoute";
import Alerta from "shared/Alerta";

function MainLayout({ children }: { children: ReactNode }) {
  const setUserAccount = useSetRecoilState(accountInState);
  const setUserRoute = useSetRecoilState(userRoute);

  const navigate = useNavigate();
  const getUser = useCallback(async () => {
    const user = await getAuthUser();

    if (user) {
      setUserAccount({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      if (user.role >= Roles.Admin) {
        setUserRoute({ request: "admin/", navigation: "admin" });
        setTimeout(() => navigate("/admin"), 1000);
      } else {
        setUserRoute({ request: "", navigation: "fans" });
        setTimeout(() => navigate("/fans"), 1000);
      }
    } else {
      navigate("/");
    }
  }, [navigate, setUserAccount, setUserRoute]);

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="min-h-full">
      <Alerta />
      {children}
    </div>
  );
}

export default MainLayout;
