import { Injectable, signal } from '@angular/core';
import { Relative, RelativeRelation, RELATION_LABELS } from '../models/relative';

const INITIAL_RELATIVES: readonly Relative[] = [
  {
    id: 'r-1',
    name: 'Maman',
    relation: 'mere',
    phone: '+221 77 123 45 67'
  },
  {
    id: 'r-2',
    name: 'Bakary Jr',
    relation: 'enfant'
  },
  {
    id: 'r-3',
    name: 'Saliou Ndiaye',
    relation: 'frere',
    phone: '+221 70 987 65 43'
  }
];

@Injectable({ providedIn: 'root' })
export class RelativeService {
  readonly relatives = signal<readonly Relative[]>(INITIAL_RELATIVES);

  getRelativeLabel(relation: RelativeRelation): string {
    return RELATION_LABELS[relation];
  }

  addRelative(name: string, relation: RelativeRelation, phone?: string): void {
    const newRelative: Relative = {
      id: `r-${Date.now()}`,
      name: name.trim(),
      relation,
      phone: phone?.trim() || undefined
    };
    this.relatives.update((prev) => [...prev, newRelative]);
  }

  updateRelative(id: string, name: string, relation: RelativeRelation, phone?: string): void {
    this.relatives.update((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, name: name.trim(), relation, phone: phone?.trim() || undefined } : r
      )
    );
  }

  removeRelative(id: string): void {
    this.relatives.update((prev) => prev.filter((r) => r.id !== id));
  }
}
