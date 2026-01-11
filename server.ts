import { SERVER_ENV } from "./src/utils/env.utils";
import logger from "@/configs/logger";

const port = SERVER_ENV.PORT;

import app from "./app";

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
