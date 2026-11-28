<script lang="ts">
  import AtlLink from "@atlas/AtlLink.svelte";
  let { label = "Example link", ...rest } = $props();
</script>

<AtlLink {...rest}>{label}</AtlLink>
