<script lang="ts">
  import AtlTooltip from "@atlas/AtlTooltip.svelte";
  let { trigger = "Passe o mouse", ...rest } = $props();
</script>

<div style="padding: 64px; display: flex; justify-content: center;">
  <AtlTooltip {...rest}>
    <span>{trigger}</span>
  </AtlTooltip>
</div>
