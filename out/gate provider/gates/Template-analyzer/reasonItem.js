"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReasonItem = void 0;
const vscode = require("vscode");
const tree_item_1 = require("../../../treeItemClasses/tree-item");
class ReasonItem extends tree_item_1.TreeItem {
    constructor(location, massage, command) {
        super(massage, vscode.TreeItemCollapsibleState.None);
        this.location = location;
        this.massage = massage;
        this.command = command;
        this.command = command;
    }
}
exports.ReasonItem = ReasonItem;
;
//# sourceMappingURL=reasonItem.js.map