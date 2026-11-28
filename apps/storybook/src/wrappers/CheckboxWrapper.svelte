<script lang="ts">
  import AtlCheckbox from "@atlas/AtlCheckbox.svelte";
  let { label = "Aceito os termos", ...rest } = $props();
</script>

<AtlCheckbox {...rest}>{label}</AtlCheckbox>
