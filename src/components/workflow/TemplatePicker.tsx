import React from "react";
import Swal from "sweetalert2";
import { WORKFLOW_TEMPLATES, type WorkflowTemplate } from "@/data/workflowTemplates";
import { useWorkflow } from "@/context/WorkflowContext";
import { LayoutTemplate } from "lucide-react";

export function TemplatePicker() {
  const { importWorkflow } = useWorkflow();

  const openTemplateModal = () => {
    const templateCards = WORKFLOW_TEMPLATES.map((t, idx) => `
      <button 
        data-template-idx="${idx}" 
        class="swal-template-card"
      >
        <div class="swal-template-icon">${t.icon}</div>
        <div class="swal-template-info">
          <div class="swal-template-name">${t.name}</div>
          <div class="swal-template-desc">${t.description}</div>
          <div class="swal-template-tags">
            ${t.tags.map((tag) => `<span class="swal-template-tag">${tag}</span>`).join("")}
          </div>
        </div>
        <svg class="swal-template-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </button>
    `).join("");

    Swal.fire({
      title: '🚀 Workflow Templates',
      html: `
        <div class="swal-template-search-wrap">
          <input type="text" id="swal-template-search" class="swal-template-search" placeholder="Search templates…" autocomplete="off" />
        </div>
        <div class="swal-template-grid" id="swal-template-grid">
          ${templateCards}
        </div>
      `,
      showConfirmButton: false,
      showCloseButton: true,
      width: 680,
      padding: '1.5rem',
      background: 'hsl(var(--card))',
      color: 'hsl(var(--foreground))',
      customClass: {
        popup: 'swal-template-popup',
        title: 'swal-template-title',
        closeButton: 'swal-template-close',
        htmlContainer: 'swal-template-container',
      },
      didOpen: (popup) => {
        const searchInput = popup.querySelector('#swal-template-search') as HTMLInputElement;
        const grid = popup.querySelector('#swal-template-grid') as HTMLElement;
        const cards = grid.querySelectorAll('.swal-template-card') as NodeListOf<HTMLElement>;

        searchInput?.focus();
        searchInput?.addEventListener('input', () => {
          const q = searchInput.value.toLowerCase();
          cards.forEach((card, idx) => {
            const t = WORKFLOW_TEMPLATES[idx];
            const match = !q || t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.tags.some((tag) => tag.toLowerCase().includes(q));
            card.style.display = match ? '' : 'none';
          });
        });

        cards.forEach((card) => {
          card.addEventListener('click', () => {
            const idx = parseInt(card.getAttribute('data-template-idx') || '0');
            const template = WORKFLOW_TEMPLATES[idx];
            if (template) {
              importWorkflow(template.build());
              Swal.close();
            }
          });
        });
      },
    });
  };

  return (
    <button
      onClick={openTemplateModal}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      title="Load a template"
    >
      <LayoutTemplate className="w-3.5 h-3.5" />
      Templates
    </button>
  );
}
