export function scrollWorkspaceToTop(workspace: HTMLElement | null) {
  if (!workspace) {
    return;
  }

  requestAnimationFrame(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    workspace.scrollIntoView({
      block: "start",
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });
  });
}
