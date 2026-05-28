import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="mb-4 text-6xl font-extrabold tracking-tight text-muted-foreground/30">404</h1>
        <p className="mb-2 text-2xl font-bold">Страница не найдена</p>
        <p className="mb-8 text-muted-foreground max-w-sm">
          Запрашиваемая страница не существует или была перемещена.
        </p>
        <Link to="/">
          <Button variant="default">
            <Home className="h-4 w-4 mr-2" />
            Вернуться на главную
          </Button>
        </Link>
      </div>
    </Layout>
  );
};

export default NotFound;
