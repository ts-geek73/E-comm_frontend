"use client";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

interface CartContextType {
  count: number;
  setCount: Dispatch<SetStateAction<number>>;
  // theme: Theme;
  // setsetTheme: Dispatch<SetStateAction<Theme>>;
}

export type Theme = "light" | "dark";
const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "cart_count";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [count, setCount] = useState<number>(0);
  // const [theme, setsetTheme] = useState<Theme>("light");

  useEffect(() => {
    const storedCount = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedCount !== null) {
      setCount(parseInt(storedCount, 10));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, count.toString());
  }, [count]);
  const value = {
    count, 
    setCount,
    //  theme, 
    // setsetTheme
  }
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
