import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AuthLayout from "../../shared/layouts/AuthLayout";
import AdminLayout from "../../shared/layouts/AdminLayout";
import SeeProductLayout from "../../shared/layouts/SeeProductLayout";
import CarLayout from "../../shared/layouts/CarLayout";


/* rutas */

import HomeRoutes from "../../modules/home/routes/HomeRoutes";
import CartRoutes from "../../modules/cart/routes/CartRoutes";
import NosotrosRoutes from "../../modules/nosotros/routes/NosotrosRoutes";

import ShopLayout from "../../shared/layouts/ShopLayout";
import ProductRoutes from "../../modules/product/routes/ProductRoutes";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>


                {/* rutas que estaran dentro del ecomerce*/}
                <Route element={<SeeProductLayout />}>
                    {/* aquí vinculamos todos los módulos como asistencia, agregar, etc */}
                    {HomeRoutes},  
                                {/* estas comas fueron una torturaaaaaaaaa 4 hrs buscando como hacer que me lo envie a /product */}
                </Route>
                <Route element={<SeeProductLayout />}>
                    {ProductRoutes}
                </Route>
                <Route element={<SeeProductLayout />}>
                    {CartRoutes}
                </Route>
                <Route element={<SeeProductLayout />}>
                    {NosotrosRoutes}
                </Route>
                {/* rutas que estaran dentro del panel administrativo*/}
                <Route element={<AdminLayout />}>
                    {/* aquí vinculamos todos los módulos como asisencia, agregar, etc */}

                </Route>
                {/* tenemos la pagina por defecto */}
                <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
        </BrowserRouter>
    );
}
