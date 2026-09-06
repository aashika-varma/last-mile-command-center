import type { AgentModule } from "../types";
import { config } from "./config";
import { getSnapshot } from "./queries";
import { View } from "./view";

export const agent: AgentModule = { config, getSnapshot, View };
