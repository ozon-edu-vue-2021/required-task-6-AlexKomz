<script>
export default {
  name: "item",
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  render() {
    const { item, $style } = this;
    const { postItem, field } = $style;
    const { id, name, postId } = item;

    return (
      <div class={postItem}>
        <img
          class={field}
          src={`https://via.placeholder.com/100x55?text=${item.id}`}
          alt=""
        />
        <span class={field}>{id}</span>
        <span class={field}>{postId}</span>
        <span class={field}>{name}</span>
      </div>
    );
  },
};
</script>

<style module>
.post-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 55px;
}

.field {
  margin-right: 16px;
}
</style>
