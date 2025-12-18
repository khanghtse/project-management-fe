import clsx from "clsx";
import { twMerge } from "tailwind-merge";

// Hàm này giúp gộp class tailwind thông minh (vd: ghi đè class cũ)
export function cn(...inputs) {
    return twMerge(clsx(inputs))
}