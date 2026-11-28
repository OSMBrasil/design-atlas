<script lang="ts">
  import AtlLink from "@atlas/AtlLink.svelte";
  let { label = "Link de exemplo", ...rest } = $props();
</script>

<AtlLink {...rest}>{label}</AtlLink>
