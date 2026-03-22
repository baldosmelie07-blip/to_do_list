function ListItem({ item }) {
  return (
    <div className="p-4 border rounded-xl">
      {item.description}
    </div>
  );
}
export default ListItem;
