<script lang="ts">
  import AtlButton from "@atlas/AtlButton.svelte";
  import AtlButtonGroup from "@atlas/AtlButtonGroup.svelte";
  let { labels = ["Primeiro", "Segundo", "Terceiro"] }: { labels?: string[] } = $props();
</script>

<AtlButtonGroup>
  {#snippet children()}
    {#each labels as text}
      <AtlButton>
        {#snippet children()}{text}{/snippet}
      </AtlButton>
    {/each}
  {/snippet}
</AtlButtonGroup>
