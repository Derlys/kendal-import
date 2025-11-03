import _ from "lodash";

export const normalizeHeader = (header: string): string => {
    return _.deburr(header)
        .toLowerCase()
        .replace(/[_\-\s]+/g, " ")
        .trim();
};
