export function findNode(node, id) {
  if(node.id == id) {
    return node;
  }
  let childs = node.children;
  if(!childs) {
    return null;
  }
  let found;
  _.each(childs, (child)=>{
    found = findNode(child, id);
    if(found) {
      return false;
    }
  });
  return found;
}
