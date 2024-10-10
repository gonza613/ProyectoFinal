import express from "express";
import morgan from "morgan";
import cors from "cors";

//Routes
import usuarioRoutes from "./routes/usuario.routes";
import loginRoutes from "./routes/login.routes"

const app = express();

//Settings
app.set("port", 4000);

//Middlewares
app.use(morgan("dev"));
app.use(express.json()); 

app.use(cors({
    origin: 'http://localhost:4200', // Permitir solo este origen
    methods: ['GET', 'POST','PUT'], // Métodos permitidos
    allowedHeaders: ['Content-Type'], // Cabeceras permitidas
}));

//Routes
app.use("/api",usuarioRoutes);
app.use("/api",loginRoutes);

export default app;