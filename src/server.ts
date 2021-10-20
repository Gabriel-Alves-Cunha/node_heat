import { httpServer } from "./app";

const PORT = 4000 as const;

httpServer.listen(PORT, () => console.log(`Listening on port ${PORT}`));
