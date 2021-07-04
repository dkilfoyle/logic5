const isArray = function (obj:unknown) {
  return Array.isArray(obj);
};

export interface TagObjectInterface {
  value: string,
  props?:  {[key:string]: string | Array<string>}
}

export function addClassToTag (tag:TagObjectInterface, tagClass: string) {
  if (!tag.props) tag.props = {};
        if (tag.props.class) {
          if (isArray(tag.props.class)) {
            (tag.props.class as Array<string>).push(tagClass);
          } else {
            tag.props.class = [tagClass, tag.props.class as string];
          }
        } else {
          tag.props.class = tagClass;
        }
}