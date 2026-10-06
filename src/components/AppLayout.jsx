import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import MainNav from "./MainNav";
import styles from "./AppLayout.module.css";

export default function AppLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className={styles.shell}>
      <MainNav />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
