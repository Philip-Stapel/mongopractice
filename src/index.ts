// we want to separate the creation and starting of the app
import { main } from "./app";
main()
  .then((app) => {
    app.listen(3000, () => {
      console.log("server is up on port " + 3000);
    });
  })
  .catch(console.error);
