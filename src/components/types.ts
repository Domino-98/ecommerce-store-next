import { RefObject } from "react";

export type Ref<T> = {
    ref?: RefObject<T>;
};