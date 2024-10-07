import app from "./app.js";

const main = () => {
    app.listen(app.get('port'));
    console.log('El puerto es:', app.get('port'));
};
main()
