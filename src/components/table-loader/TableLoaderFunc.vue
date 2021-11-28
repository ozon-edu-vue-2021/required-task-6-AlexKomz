<script>
import { loader } from "./TableLoader.module.css";

export default {
  name: "TableLoader",
  functional: true,
  render: () => {
    return (
      <div class={loader}>
        <div />
        <div />
        <div />
        <div />
      </div>
    );
  },
};
</script>
