import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { CartProvider } from "@/components/shop/cart/CartProvider";
import { AuthProvider } from "@/context/AuthContext";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <Nav />
        <div className="flex flex-1 flex-col">{children}</div>
        <Footer />
      </CartProvider>
    </AuthProvider>
  );
}
