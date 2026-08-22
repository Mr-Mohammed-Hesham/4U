import { Curriculum } from '../types';
import { math12Curriculum } from '../curriculum/uae/moe/grade12/math';
import { physics12Curriculum } from '../curriculum/uae/moe/grade12/physics';
import { mathOthersCurriculum } from '../curriculum/mathOthers';
import { physicsOthersCurriculum } from '../curriculum/physicsOthers';
import {
  phy12General1,
  phy12Inspire1,
  math11AdvBridge1,
  math12General1,
  phy11AdvBridge1,
  math11General1
} from '../curriculum/uae/addedCurriculums';

// Grade 9 Physics & Math
import { phy9AdvBridge1, phy9AdvInspire1 } from '../curriculum/uae/grade9Physics';
import { math9AdvInspire1, math9AdvBridge1 } from '../curriculum/uae/grade9Math';

// Grade 10 Physics & Math
import { phy10AdvInspire1, phy10AdvBridge1 } from '../curriculum/uae/grade10Physics';
import { math10General1 } from '../curriculum/uae/grade10MathGeneral';
import { math10AdvBridge1 } from '../curriculum/uae/grade10MathBridge';
import { math10AdvInspire1 } from '../curriculum/uae/grade10MathInspire';

// Grade 7 Math & Physics (General & Advanced)
import { math7General1 } from '../curriculum/uae/grade7MathGeneral';
import { math7AdvBridge1, math7AdvInspire1 } from '../curriculum/uae/grade7MathAdv';
import { phy7General1, phy7AdvBridge1, phy7AdvInspire1 } from '../curriculum/uae/grade7Physics';

// Grade 8 Math & Physics (General & Advanced)
import { math8General1 } from '../curriculum/uae/grade8MathGeneral';
import { math8AdvBridge1, math8AdvInspire1 } from '../curriculum/uae/grade8MathAdv';
import { phy8General1, phy8AdvBridge1, phy8AdvInspire1 } from '../curriculum/uae/grade8Physics';

export const curriculums: Record<string, Curriculum> = {
  ...math12Curriculum,
  ...mathOthersCurriculum,
  ...physics12Curriculum,
  ...physicsOthersCurriculum,

  // --- Grade 7 Curriculums (General & Advanced) ---
  // Grade 7 Math General Term 1
  'math-7-general-1': math7General1,
  'UAE-math-7-general-1': math7General1,
  'math-7-gen-1': math7General1,
  'UAE-math-7-gen-1': math7General1,

  // Grade 7 Math Advanced Bridge Term 1
  'math-7-adv-bridge-1': math7AdvBridge1,
  'UAE-math-7-adv-bridge-1': math7AdvBridge1,
  'math-7-bridge-1': math7AdvBridge1,
  'UAE-math-7-bridge-1': math7AdvBridge1,
  'math-7-advanced-1': math7AdvBridge1,
  'UAE-math-7-advanced-1': math7AdvBridge1,

  // Grade 7 Math Advanced Inspire Term 1
  'math-7-adv-inspire-1': math7AdvInspire1,
  'UAE-math-7-adv-inspire-1': math7AdvInspire1,
  'math-7-inspire-1': math7AdvInspire1,
  'UAE-math-7-inspire-1': math7AdvInspire1,

  // Grade 7 Physics / Science General Term 1
  'physics-7-general-1': phy7General1,
  'UAE-physics-7-general-1': phy7General1,
  'phy-7-general-1': phy7General1,
  'UAE-phy-7-general-1': phy7General1,
  'physics-7-gen-1': phy7General1,
  'UAE-physics-7-gen-1': phy7General1,
  'phy-7-gen-1': phy7General1,
  'UAE-phy-7-gen-1': phy7General1,

  // Grade 7 Physics / Science Advanced Bridge Term 1
  'physics-7-adv-bridge-1': phy7AdvBridge1,
  'UAE-physics-7-adv-bridge-1': phy7AdvBridge1,
  'phy-7-adv-bridge-1': phy7AdvBridge1,
  'UAE-phy-7-adv-bridge-1': phy7AdvBridge1,
  'physics-7-bridge-1': phy7AdvBridge1,
  'UAE-physics-7-bridge-1': phy7AdvBridge1,
  'phy-7-bridge-1': phy7AdvBridge1,
  'UAE-phy-7-bridge-1': phy7AdvBridge1,
  'physics-7-advanced-1': phy7AdvBridge1,
  'UAE-physics-7-advanced-1': phy7AdvBridge1,

  // Grade 7 Physics / Science Advanced Inspire Term 1
  'physics-7-adv-inspire-1': phy7AdvInspire1,
  'UAE-physics-7-adv-inspire-1': phy7AdvInspire1,
  'phy-7-adv-inspire-1': phy7AdvInspire1,
  'UAE-phy-7-adv-inspire-1': phy7AdvInspire1,
  'physics-7-inspire-1': phy7AdvInspire1,
  'UAE-physics-7-inspire-1': phy7AdvInspire1,
  'phy-7-inspire-1': phy7AdvInspire1,
  'UAE-phy-7-inspire-1': phy7AdvInspire1,

  // --- Grade 8 Curriculums (General & Advanced) ---
  // Grade 8 Math General Term 1
  'math-8-general-1': math8General1,
  'UAE-math-8-general-1': math8General1,
  'math-8-gen-1': math8General1,
  'UAE-math-8-gen-1': math8General1,

  // Grade 8 Math Advanced Bridge Term 1
  'math-8-adv-bridge-1': math8AdvBridge1,
  'UAE-math-8-adv-bridge-1': math8AdvBridge1,
  'math-8-bridge-1': math8AdvBridge1,
  'UAE-math-8-bridge-1': math8AdvBridge1,
  'math-8-advanced-1': math8AdvBridge1,
  'UAE-math-8-advanced-1': math8AdvBridge1,

  // Grade 8 Math Advanced Inspire Term 1
  'math-8-adv-inspire-1': math8AdvInspire1,
  'UAE-math-8-adv-inspire-1': math8AdvInspire1,
  'math-8-inspire-1': math8AdvInspire1,
  'UAE-math-8-inspire-1': math8AdvInspire1,

  // Grade 8 Physics / Science General Term 1
  'physics-8-general-1': phy8General1,
  'UAE-physics-8-general-1': phy8General1,
  'phy-8-general-1': phy8General1,
  'UAE-phy-8-general-1': phy8General1,
  'physics-8-gen-1': phy8General1,
  'UAE-physics-8-gen-1': phy8General1,
  'phy-8-gen-1': phy8General1,
  'UAE-phy-8-gen-1': phy8General1,

  // Grade 8 Physics / Science Advanced Bridge Term 1
  'physics-8-adv-bridge-1': phy8AdvBridge1,
  'UAE-physics-8-adv-bridge-1': phy8AdvBridge1,
  'phy-8-adv-bridge-1': phy8AdvBridge1,
  'UAE-phy-8-adv-bridge-1': phy8AdvBridge1,
  'physics-8-bridge-1': phy8AdvBridge1,
  'UAE-physics-8-bridge-1': phy8AdvBridge1,
  'phy-8-bridge-1': phy8AdvBridge1,
  'UAE-phy-8-bridge-1': phy8AdvBridge1,
  'physics-8-advanced-1': phy8AdvBridge1,
  'UAE-physics-8-advanced-1': phy8AdvBridge1,

  // Grade 8 Physics / Science Advanced Inspire Term 1
  'physics-8-adv-inspire-1': phy8AdvInspire1,
  'UAE-physics-8-adv-inspire-1': phy8AdvInspire1,
  'phy-8-adv-inspire-1': phy8AdvInspire1,
  'UAE-phy-8-adv-inspire-1': phy8AdvInspire1,
  'physics-8-inspire-1': phy8AdvInspire1,
  'UAE-physics-8-inspire-1': phy8AdvInspire1,
  'phy-8-inspire-1': phy8AdvInspire1,
  'UAE-phy-8-inspire-1': phy8AdvInspire1,

  // Added UAE Curriculums
  'physics-12-general-1': phy12General1,
  'UAE-physics-12-general-1': phy12General1,
  'phy-12-general-1': phy12General1,
  'UAE-phy-12-general-1': phy12General1,

  'physics-12-inspire-1': phy12Inspire1,
  'UAE-physics-12-inspire-1': phy12Inspire1,
  'phy-12-inspire-1': phy12Inspire1,
  'UAE-phy-12-inspire-1': phy12Inspire1,

  // Grade 11 Inspire Physics is same as Grade 12 Inspire Physics Term 1
  'physics-11-inspire-1': phy12Inspire1,
  'UAE-physics-11-inspire-1': phy12Inspire1,
  'phy-11-inspire-1': phy12Inspire1,
  'UAE-phy-11-inspire-1': phy12Inspire1,

  'math-11-bridge-1': math11AdvBridge1,
  'UAE-math-11-bridge-1': math11AdvBridge1,
  'math-11-adv-bridge-1': math11AdvBridge1,
  'UAE-math-11-adv-bridge-1': math11AdvBridge1,

  'math-12-general-1': math12General1,
  'UAE-math-12-general-1': math12General1,

  // Grade 11 Advanced Physics Bridge Term 1
  'physics-11-bridge-1': phy11AdvBridge1,
  'UAE-physics-11-bridge-1': phy11AdvBridge1,
  'phy-11-bridge-1': phy11AdvBridge1,
  'UAE-phy-11-bridge-1': phy11AdvBridge1,
  'physics-11-adv-bridge-1': phy11AdvBridge1,
  'UAE-physics-11-adv-bridge-1': phy11AdvBridge1,
  'phy-11-adv-bridge-1': phy11AdvBridge1,
  'UAE-phy-11-adv-bridge-1': phy11AdvBridge1,

  // Grade 11 General Math Term 1
  'math-11-general-1': math11General1,
  'UAE-math-11-general-1': math11General1,
  'math-11-gen-1': math11General1,
  'UAE-math-11-gen-1': math11General1,

  // Grade 9 Physics (Adv Bridge 1 & Adv Inspire 1)
  'phy-9-adv-bridge-1': phy9AdvBridge1,
  'UAE-phy-9-adv-bridge-1': phy9AdvBridge1,
  'physics-9-adv-bridge-1': phy9AdvBridge1,
  'UAE-physics-9-adv-bridge-1': phy9AdvBridge1,
  'physics-9-bridge-1': phy9AdvBridge1,
  'UAE-physics-9-bridge-1': phy9AdvBridge1,

  'phy-9-adv-inspire-1': phy9AdvInspire1,
  'UAE-phy-9-adv-inspire-1': phy9AdvInspire1,
  'physics-9-adv-inspire-1': phy9AdvInspire1,
  'UAE-physics-9-adv-inspire-1': phy9AdvInspire1,
  'physics-9-inspire-1': phy9AdvInspire1,
  'UAE-physics-9-inspire-1': phy9AdvInspire1,

  // Grade 9 Math (Adv Inspire 1 & Adv Bridge 1)
  'math-9-adv-inspire-1': math9AdvInspire1,
  'UAE-math-9-adv-inspire-1': math9AdvInspire1,
  'math-9-inspire-1': math9AdvInspire1,
  'UAE-math-9-inspire-1': math9AdvInspire1,
  'math-9-adv-bridge-1': math9AdvBridge1,
  'UAE-math-9-adv-bridge-1': math9AdvBridge1,
  'math-9-bridge-1': math9AdvBridge1,
  'UAE-math-9-bridge-1': math9AdvBridge1,

  // Grade 10 Physics (Adv Inspire 1 & Adv Bridge 1)
  'phy-10-adv-inspire-1': phy10AdvInspire1,
  'UAE-phy-10-adv-inspire-1': phy10AdvInspire1,
  'physics-10-adv-inspire-1': phy10AdvInspire1,
  'UAE-physics-10-adv-inspire-1': phy10AdvInspire1,
  'physics-10-inspire-1': phy10AdvInspire1,
  'UAE-physics-10-inspire-1': phy10AdvInspire1,

  'phy-10-adv-bridge-1': phy10AdvBridge1,
  'UAE-phy-10-adv-bridge-1': phy10AdvBridge1,
  'physics-10-adv-bridge-1': phy10AdvBridge1,
  'UAE-physics-10-adv-bridge-1': phy10AdvBridge1,
  'physics-10-bridge-1': phy10AdvBridge1,
  'UAE-physics-10-bridge-1': phy10AdvBridge1,

  // Grade 10 Math (General 1, Adv Bridge 1, Adv Inspire 1)
  'math-10-general-1': math10General1,
  'UAE-math-10-general-1': math10General1,

  'math-10-adv-bridge-1': math10AdvBridge1,
  'UAE-math-10-adv-bridge-1': math10AdvBridge1,
  'math-10-bridge-1': math10AdvBridge1,
  'UAE-math-10-bridge-1': math10AdvBridge1,

  'math-10-adv-inspire-1': math10AdvInspire1,
  'UAE-math-10-adv-inspire-1': math10AdvInspire1,
  'math-10-inspire-1': math10AdvInspire1,
  'UAE-math-10-inspire-1': math10AdvInspire1
};
