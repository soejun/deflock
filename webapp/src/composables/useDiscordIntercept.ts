
export function useDiscordIntercept() {
  const showDialog = ref(false);
  const discordUrl = ref('');

  function interceptDiscordLinks() {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      let link: HTMLAnchorElement | null = null;
      if (target.tagName === 'A') {
        link = target as HTMLAnchorElement;
      } else {
        link = target.closest('a');
      }
      if (link && link.href && (link.href.includes('discord.gg') || link.href.includes('discord.com'))) {
        e.preventDefault();
        discordUrl.value = link.href;
        showDialog.value = true;
      }
    }, true);
  }

  return { showDialog, discordUrl, interceptDiscordLinks };
}
