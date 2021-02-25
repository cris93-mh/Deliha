
# Deliha, proyecto final BACKEND!

## Tecnologías a usar!!

-Mysql server v5.7
-Node.js, v15.7.0


### Documentación de la API!!!

-Usted puede encontrar la documentación de la API en `cristian.montoya-deliha_RestoAPI-1.0.0.yaml`, luego se necesita copiar el contenido y luego pegarlo en [swagger](https://app.swaggerhub.com/ 'swagger'), luego edite o importe el documento para visualizar los endpoints.

#### Ahora procedemos con la respectiva Guía de Instalación!!!!

-Podrás descargar el proyecto o clonarlo del repositorio oficial!
--Clonar el proyecto...

    Abrimos una terminal en la carpeta donde queremos clonar nuestro proyecto y ejecutamos el siguiente comando

        C:\Users\cristian\Desktop>  git clone https://github.com/cris93-mh/Deliha.git

    nos ubicamos en el proyecto que acabamos de clonar

        C:\Users\cristian\Desktop> cd Deliha/

    verificamos que en la raíz de nuestro proyecto esté el archivo 'package.json'

    -Instalamos las dependencias 

        C:\Users\cristian\Desktop\Deliha> npm install



--Descargas!!

    Vamos al Link de descarga.. [link](https://github.com/cris93-mh/Deliha.git 'link')

    Descomprimimos el proyecto que se acaba de descargar

    Ingresamos en la carpeta principal de nuestro proyecto

    Abrimos una terminal y nos ubicamos en la carpeta raíz de nuestro proyecto

    Instalamos las dependencias 

        C:\Users\cristian\Desktop\Deliha> npm install

##### Ahora procedemos con la configuración de la Base de Datos!!!!!

-Se instala la base de datos con mysql,en la ruta: "DELIHA/DATABASE/delilahdatabase.sql"
  luego en la terminal de mysql se utiliza la base de datos a trabajar..

###### Ahora procedemos a iniciar el servidor!!!!!!

`node server`, en la terminal del proyecto se ejecuta el comando node server.js donde server.js es el documento del servidor el cual tiene lo requerido para que el mismo empiece a correr incluyendo el puerto donde va a escuchar cuando se haga la petición http.

###### Ahora procedemos a abrir el postman y verificar los endpoints correspondientes al proyecto!!!!!!!

-El post requerido para verificar los endpoints
--Se listan las peticiones de los usuarios!!
-- Cualquier usuario
    POST
        host:port/orders 
        host:port/register
        host:port/login
    GET
        host:port/products
        host:port/products/:id

--Solo usuario Administrador
    GET
        host:port/orders
        host:port/orders/:id
        host:port/users
        host:port/users/:id
    POST
        host:port/products
    PUT
        host:port/products/:id
        host:port/orders/:id
    DELETE
        host:port/products/:id
        host:port/orders/:id
        host:port/users/:id

###### Puerto del servidor !!!!!

`8000`

###### La aplicación está lista para usarse !!!!!!!!