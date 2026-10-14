import { Curriculum } from '../../types';

// UAE Grade 10 Advanced Bridge Mathematics English Curriculum Term 1 (2026)
// 4 Comprehensive Modules:
// 1. Polynomials & Polynomial Functions (Polynomial)
// 2. Quadrilaterals
// 3. Similarity
// 4. Right Triangles and Trigonometry

export const math10AdvBridgeEnglish2026: Curriculum = {
  isEnglish: true,
  studentBookUrl: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-0/',
  units: [
    {
      id: 1,
      name: 'Module 1: Polynomials & Polynomial Functions',
      icon: '🔢',
      color: 'from-blue-600 to-indigo-700',
      description: 'Study operations with polynomials, long and synthetic division, polynomial functions and their graphs, factoring techniques, remainder and factor theorems, and the Fundamental Theorem of Algebra.',
      lessons: [
        {
          id: 1,
          title: 'Lesson 1-1: Operations with Monomials and Polynomials',
          focusQuestion: 'How do exponent properties govern operations on monomials and polynomials?',
          icon: '➕',
          duration: '50 min',
          lessonUrl: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-1.1/',
          examUrl: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-1.1-exam/',
          lessonTitle: '📖 Lesson Explanation',
          examTitle: '📝 Module 1 Quiz 1',
          content: {
            intro: 'A polynomial is an expression consisting of variables and coefficients combined using addition, subtraction, multiplication, and non-negative integer exponents.',
            sections: [
              {
                title: 'Exponent Properties',
                type: 'bullets',
                content: [
                  'Product of Powers: xᵃ · xᵇ = xᵃ⁺ᵇ',
                  'Quotient of Powers: xᵃ / xᵇ = xᵃ⁻ᵇ (x ≠ 0)',
                  'Power of a Power: (xᵃ)ᵇ = xᵃᵇ',
                  'Power of a Product: (xy)ᵃ = xᵃ · yᵃ',
                  'Power of a Quotient: (x/y)ᵃ = xᵃ / yᵃ (y ≠ 0)',
                  'Zero Exponent: x⁰ = 1 (x ≠ 0)',
                  'Negative Exponent: x⁻ᵃ = 1 / xᵃ'
                ]
              },
              {
                title: 'Adding, Subtracting, and Multiplying Polynomials',
                type: 'bullets',
                content: [
                  'To add polynomials, combine like terms with the same variable and exponent.',
                  'To subtract polynomials, add the additive opposite of each term in the second polynomial.',
                  'To multiply polynomials, distribute each term of the first polynomial to every term of the second (FOIL for binomials).'
                ]
              }
            ]
          }
        },
        {
          id: 2,
          title: 'Lesson 1-2: Dividing Polynomials (Long Division & Synthetic Division)',
          focusQuestion: 'How do long division and synthetic division simplify polynomial quotients?',
          icon: '➗',
          duration: '55 min',
          lessonUrl: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-1.2/',
          examUrl: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-1.2-exam/',
          lessonTitle: '📖 Lesson Explanation',
          examTitle: '📝 Module 1 Quiz 2',
          content: {
            intro: 'Division of polynomials is essential for simplifying rational expressions and determining linear factors.',
            sections: [
              {
                title: 'Polynomial Long Division Algorithm',
                type: 'bullets',
                content: [
                  'Write dividend and divisor in descending order of exponents.',
                  'Insert 0 coefficients for missing powers of x.',
                  'Divide the leading term of the dividend by the leading term of the divisor.',
                  'Multiply the quotient term by the entire divisor and subtract.',
                  'Repeat until the degree of the remainder is less than the degree of the divisor: P(x)/D(x) = Q(x) + R(x)/D(x).'
                ]
              },
              {
                title: 'Synthetic Division for Linear Divisors (x - c)',
                type: 'bullets',
                content: [
                  'Only used when dividing by a linear binomial in the form (x - c).',
                  'Write c in the box and list the coefficients of the polynomial in descending order.',
                  'Bring down the leading coefficient, multiply by c, place in the next column, and add vertically.',
                  'The bottom row gives the coefficients of the depressed quotient polynomial and the final number is the remainder.'
                ]
              }
            ]
          }
        },
        {
          id: 3,
          title: 'Lesson 1-3: Polynomial Functions and End Behavior',
          focusQuestion: 'How does the Leading Coefficient Test predict the global behavior of polynomial graphs?',
          icon: '📈',
          duration: '50 min',
          lessonUrl: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-1.3/',
          examUrl: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-1.3-exam/',
          lessonTitle: '📖 Lesson Explanation',
          examTitle: '📝 Module 1 Quiz 3',
          content: {
            intro: 'The degree and leading coefficient of a polynomial function determine the end behavior and maximum number of turning points of its graph.',
            sections: [
              {
                title: 'Leading Coefficient Test for End Behavior',
                type: 'bullets',
                content: [
                  'Even Degree, Positive Leading Coefficient (aₙ > 0): Up on left and up on right (as x → ±∞, f(x) → +∞).',
                  'Even Degree, Negative Leading Coefficient (aₙ < 0): Down on left and down on right (as x → ±∞, f(x) → -∞).',
                  'Odd Degree, Positive Leading Coefficient (aₙ > 0): Down on left and up on right (as x → -∞, f(x) → -∞; as x → +∞, f(x) → +∞).',
                  'Odd Degree, Negative Leading Coefficient (aₙ < 0): Up on left and down on right (as x → -∞, f(x) → +∞; as x → +∞, f(x) → -∞).'
                ]
              },
              {
                title: 'Zeros and Turning Points',
                type: 'formula',
                content: 'A polynomial function of degree n has at most n real zeros and at most (n - 1) turning points.'
              }
            ]
          }
        },
        {
          id: 4,
          title: 'Lesson 1-4: Factoring and Solving Polynomial Equations',
          focusQuestion: 'What algebraic techniques allow us to factor higher-degree polynomials?',
          icon: '🧩',
          duration: '55 min',
          lessonUrl: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-1.4/',
          examUrl: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-1.4-exam/',
          lessonTitle: '📖 Lesson Explanation',
          examTitle: '📝 Module 1 Quiz 4',
          content: {
            intro: 'Factoring converts polynomial equations into products of lower-degree factors, enabling solutions via the Zero Product Property.',
            sections: [
              {
                title: 'Key Factoring Formulas',
                type: 'formula',
                content: 'Sum of Two Cubes: a³ + b³ = (a + b)(a² - ab + b²)\nDifference of Two Cubes: a³ - b³ = (a - b)(a² + ab + b²)\nDifference of Two Squares: a² - b² = (a - b)(a + b)'
              },
              {
                title: 'Factoring by Grouping and Quadratic Form',
                type: 'bullets',
                content: [
                  'Grouping: For four terms, group in pairs ax + ay + bx + by = a(x + y) + b(x + y) = (a + b)(x + y).',
                  'Quadratic Form: au² + bu + c = 0 where u = xⁿ (e.g., ax⁴ + bx² + c = 0 with u = x²).'
                ]
              }
            ]
          }
        },
        {
          id: 5,
          title: 'Lesson 1-5: The Remainder and Factor Theorems',
          focusQuestion: 'How do synthetic substitution and the Factor Theorem identify roots of polynomials?',
          icon: '📜',
          duration: '50 min',
          lessonUrl: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-1.5/',
          examUrl: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-1.5-exam/',
          lessonTitle: '📖 Lesson Explanation',
          examTitle: '📝 Module 1 Quiz 5',
          content: {
            intro: 'The Remainder and Factor Theorems provide rapid algebraic tests to evaluate functions and confirm whether a linear binomial divides a polynomial evenly.',
            sections: [
              {
                title: 'The Remainder Theorem',
                type: 'formula',
                content: 'If a polynomial f(x) is divided by (x - c), the remainder is equal to f(c).'
              },
              {
                title: 'The Factor Theorem',
                type: 'formula',
                content: 'The binomial (x - c) is a factor of the polynomial f(x) if and only if f(c) = 0.'
              }
            ]
          }
        },
        {
          id: 6,
          title: 'Lesson 1-6: Roots, Zeros, and the Fundamental Theorem of Algebra',
          focusQuestion: 'Why does a polynomial of degree n always have exactly n complex roots?',
          icon: '✨',
          duration: '60 min',
          lessonUrl: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-1.6/',
          examUrl: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-1.6-exam/',
          lessonTitle: '📖 Lesson Explanation',
          examTitle: '📝 Module 1 Comprehensive Exam',
          content: {
            intro: 'The Fundamental Theorem of Algebra establishes the completeness of complex numbers for polynomial factorization.',
            sections: [
              {
                title: 'The Fundamental Theorem of Algebra',
                type: 'formula',
                content: 'Every polynomial equation of degree n ≥ 1 with complex coefficients has exactly n complex roots (counting multiplicity).'
              },
              {
                title: 'Rational Zero Theorem and Complex Conjugates',
                type: 'bullets',
                content: [
                  'Rational Zero Theorem: Possible rational roots are of the form ±p/q, where p is a factor of constant term a₀ and q is a factor of leading coefficient aₙ.',
                  'Complex Conjugate Theorem: If a + bi is a zero (b ≠ 0), then its conjugate a - bi is also a zero.',
                  'Descartes\' Rule of Signs: The number of positive real zeros equals sign changes or less by an even integer.'
                ]
              }
            ]
          }
        }
      ]
    },
    {
      id: 2,
      name: 'Module 2: Quadrilaterals',
      icon: '⬜',
      color: 'from-purple-600 to-pink-600',
      description: 'Analyze polygon interior and exterior angles, parallelograms, coordinate and algebraic tests for parallelograms, special parallelograms (rectangles, rhombi, squares), and trapezoids, isosceles trapezoids, and kites.',
      lessons: [
        {
          id: 1,
          title: 'Lesson 2-1: Angles of Polygons (Interior & Exterior)',
          focusQuestion: 'How are interior and exterior angle sums related to the number of sides in any convex polygon?',
          icon: '📐',
          duration: '50 min',
          lessonUrl: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-2.1/',
          examUrl: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-2.1-exam/',
          lessonTitle: '📖 Lesson Explanation',
          examTitle: '📝 Module 2 Quiz 1',
          content: {
            intro: 'Polygons are closed plane figures with straight sides. Angle theorems quantify total and individual angle measures.',
            sections: [
              {
                title: 'Polygon Interior Angle Sum Theorem',
                type: 'formula',
                content: 'Sum of interior angles = (n - 2) × 180°\nFor a regular n-gon, each interior angle = [(n - 2) × 180°] / n'
              },
              {
                title: 'Polygon Exterior Angle Sum Theorem',
                type: 'formula',
                content: 'Sum of exterior angles (one per vertex) = 360° for any convex polygon\nFor a regular n-gon, each exterior angle = 360° / n'
              }
            ]
          }
        },
        {
          id: 2,
          title: 'Lesson 2-2: Properties of Parallelograms',
          focusQuestion: 'What essential geometric properties characterize every parallelogram?',
          icon: '▰',
          duration: '50 min',
          lessonUrl: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-2.2/',
          examUrl: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-2.2-exam/',
          lessonTitle: '📖 Lesson Explanation',
          examTitle: '📝 Module 2 Quiz 2',
          content: {
            intro: 'A parallelogram is a quadrilateral with both pairs of opposite sides parallel.',
            sections: [
              {
                title: 'Core Parallelogram Theorems',
                type: 'bullets',
                content: [
                  'Opposite sides are congruent: AB ≅ CD and BC ≅ DA.',
                  'Opposite angles are congruent: ∠A ≅ ∠C and ∠B ≅ ∠D.',
                  'Consecutive angles are supplementary: m∠A + m∠B = 180°.',
                  'Diagonals bisect each other: If diagonals AC and BD intersect at M, then AM = MC and BM = MD.',
                  'A diagonal separates a parallelogram into two congruent triangles.'
                ]
              }
            ]
          }
        },
        {
          id: 3,
          title: 'Lesson 2-3: Tests for Parallelograms',
          focusQuestion: 'What conditions prove that a given quadrilateral is a parallelogram?',
          icon: '🔍',
          duration: '55 min',
          lessonUrl: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-2.3/',
          examUrl: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-2.3-exam/',
          lessonTitle: '📖 Lesson Explanation',
          examTitle: '📝 Module 2 Quiz 3',
          content: {
            intro: 'We can prove a quadrilateral is a parallelogram using side lengths, angle measures, diagonals, or coordinate formulas (distance, slope, midpoint).',
            sections: [
              {
                title: 'Five Sufficient Conditions for Parallelograms',
                type: 'bullets',
                content: [
                  '1. Both pairs of opposite sides are parallel (Definition: slopes are equal).',
                  '2. Both pairs of opposite sides are congruent (Distance formula).',
                  '3. Both pairs of opposite angles are congruent.',
                  '4. Diagonals bisect each other (Same midpoint).',
                  '5. One pair of opposite sides is both parallel AND congruent (Equal slope & equal distance).'
                ]
              }
            ]
          }
        },
        {
          id: 4,
          title: 'Lesson 2-4: Special Parallelograms (Rectangles, Rhombi, Squares)',
          focusQuestion: 'How do diagonals uniquely identify rectangles, rhombi, and squares?',
          icon: '💎',
          duration: '60 min',
          lessonUrl: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-2.4/',
          examUrl: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-2.4-exam/',
          lessonTitle: '📖 Lesson Explanation',
          examTitle: '📝 Module 2 Quiz 4',
          content: {
            intro: 'Rectangles, rhombi, and squares inherit all parallelogram properties and have distinct diagonal relationships.',
            sections: [
              {
                title: 'Rectangle Properties',
                type: 'bullets',
                content: [
                  'All four angles are right angles (90°).',
                  'Diagonals are congruent: AC = BD.'
                ]
              },
              {
                title: 'Rhombus Properties',
                type: 'bullets',
                content: [
                  'All four sides are congruent.',
                  'Diagonals are perpendicular: AC ⊥ BD (product of slopes = -1).',
                  'Diagonals bisect opposite angles.'
                ]
              },
              {
                title: 'Square Properties',
                type: 'formula',
                content: 'A square is both a rectangle and a rhombus: 4 congruent sides, 4 right angles, diagonals are both congruent AND perpendicular bisectors.'
              }
            ]
          }
        },
        {
          id: 5,
          title: 'Lesson 2-5: Trapezoids and Kites',
          focusQuestion: 'What are the properties of isosceles trapezoids, trapezoid midsegments, and kites?',
          icon: '🪁',
          duration: '55 min',
          lessonUrl: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-2.5/',
          examUrl: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-2.5-exam/',
          lessonTitle: '📖 Lesson Explanation',
          examTitle: '📝 Module 2 Comprehensive Exam',
          content: {
            intro: 'Trapezoids and kites are non-parallelogram quadrilaterals with specific parallel or perpendicular configurations.',
            sections: [
              {
                title: 'Isosceles Trapezoid Theorems',
                type: 'bullets',
                content: [
                  'A trapezoid has exactly one pair of parallel sides (bases).',
                  'In an isosceles trapezoid, non-parallel legs are congruent.',
                  'Base angles are congruent: ∠A ≅ ∠B and ∠C ≅ ∠D.',
                  'Diagonals of an isosceles trapezoid are congruent: AC = BD.'
                ]
              },
              {
                title: 'Trapezoid Midsegment Theorem',
                type: 'formula',
                content: 'Midsegment = ½(Base₁ + Base₂) and is parallel to both bases'
              },
              {
                title: 'Kite Properties',
                type: 'bullets',
                content: [
                  'A kite has two pairs of consecutive congruent sides and no opposite parallel sides.',
                  'Diagonals are perpendicular: d₁ ⊥ d₂.',
                  'Exactly one pair of opposite angles is congruent (between non-congruent sides).'
                ]
              }
            ]
          }
        }
      ]
    },
    {
      id: 3,
      name: 'Module 3: Similarity',
      icon: '📐',
      color: 'from-teal-600 to-emerald-700',
      description: 'Study ratios and proportions, similar polygons and scale factors, triangle similarity criteria (AA, SAS, SSS), parallel lines and proportional parts, and proportional special segments in similar triangles.',
      lessons: [
        {
          id: 1,
          title: 'Lesson 3-1: Ratios, Proportions, and Similar Polygons',
          focusQuestion: 'How does the scale factor relate corresponding side lengths and perimeters of similar polygons?',
          icon: '⚖️',
          duration: '50 min',
          lessonUrl: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-3.1/',
          examUrl: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-3.1-exam/',
          lessonTitle: '📖 Lesson Explanation',
          examTitle: '📝 Module 3 Quiz 1',
          content: {
            intro: 'Two polygons are similar (~) if and only if corresponding angles are congruent and corresponding side lengths are proportional.',
            sections: [
              {
                title: 'Properties of Proportions',
                type: 'formula',
                content: 'Cross Products Property: If a/b = c/d, then ad = bc (b, d ≠ 0)'
              },
              {
                title: 'Scale Factor and Perimeters Theorem',
                type: 'bullets',
                content: [
                  'Scale factor k is the ratio of corresponding side lengths: k = side₁ / side₂.',
                  'Perimeters Theorem: If two polygons are similar with scale factor k, the ratio of their perimeters equals k.',
                  'Area Ratio: The ratio of their areas equals k².'
                ]
              }
            ]
          }
        },
        {
          id: 2,
          title: 'Lesson 3-2: Similar Triangles (AA, SAS, SSS Criteria)',
          focusQuestion: 'What minimal information proves that two triangles are similar?',
          icon: '🔺',
          duration: '55 min',
          lessonUrl: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-3.2/',
          examUrl: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-3.2-exam/',
          lessonTitle: '📖 Lesson Explanation',
          examTitle: '📝 Module 3 Quiz 2',
          content: {
            intro: 'Triangle similarity postulates and theorems allow us to prove similarity without checking all six pairs of angles and sides.',
            sections: [
              {
                title: 'Triangle Similarity Criteria',
                type: 'bullets',
                content: [
                  'AA Similarity Postulate (Angle-Angle): If two angles of one triangle are congruent to two angles of another triangle, the triangles are similar.',
                  'SSS Similarity Theorem (Side-Side-Side): If corresponding sides of two triangles are proportional, then the triangles are similar: a/d = b/e = c/f.',
                  'SAS Similarity Theorem (Side-Angle-Side): If two pairs of corresponding sides are proportional and their included angles are congruent, the triangles are similar.'
                ]
              }
            ]
          }
        },
        {
          id: 3,
          title: 'Lesson 3-3: Parallel Lines and Proportional Parts',
          focusQuestion: 'How does the Triangle Proportionality Theorem divide triangle sides and transversals?',
          icon: '📏',
          duration: '50 min',
          lessonUrl: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-3.3/',
          examUrl: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-3.3-exam/',
          lessonTitle: '📖 Lesson Explanation',
          examTitle: '📝 Module 3 Quiz 3',
          content: {
            intro: 'Parallel lines intersecting transversals create proportional segments across triangles and parallel planes.',
            sections: [
              {
                title: 'Triangle Proportionality Theorem',
                type: 'formula',
                content: 'If a line is parallel to one side of a triangle intersecting the other two sides, it divides the two sides proportionally:\nIf DE ∥ BC in △ABC, then AD / DB = AE / EC'
              },
              {
                title: 'Converse and Midsegment Theorem',
                type: 'bullets',
                content: [
                  'Converse: If a line divides two sides of a triangle proportionally, it is parallel to the third side.',
                  'Triangle Midsegment: Connects midpoints of two sides; it is parallel to the third side and its length is exactly half: Midsegment = ½(Base).'
                ]
              }
            ]
          }
        },
        {
          id: 4,
          title: 'Lesson 3-4: Parts of Similar Triangles (Special Segments)',
          focusQuestion: 'How do altitudes, angle bisectors, and medians relate to the scale factor in similar triangles?',
          icon: '✂️',
          duration: '55 min',
          lessonUrl: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-3.4/',
          examUrl: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-3.4-exam/',
          lessonTitle: '📖 Lesson Explanation',
          examTitle: '📝 Module 3 Quiz 4',
          content: {
            intro: 'Corresponding special segments in similar triangles are proportional to the corresponding side lengths with the exact same scale factor.',
            sections: [
              {
                title: 'Special Segments Theorems',
                type: 'bullets',
                content: [
                  'Altitudes: The ratio of corresponding altitudes equals the ratio of corresponding sides.',
                  'Angle Bisectors: The ratio of corresponding angle bisectors equals the ratio of corresponding sides.',
                  'Medians: The ratio of corresponding medians equals the ratio of corresponding sides.'
                ]
              },
              {
                title: 'Triangle Angle Bisector Theorem',
                type: 'formula',
                content: 'An angle bisector in a triangle separates the opposite side into segments proportional to the other two sides:\nIn △ABC with bisector AD: BD / DC = AB / AC'
              }
            ]
          }
        },
        {
          id: 5,
          title: 'Lesson 3-5: Similarity Transformations and Dilations',
          focusQuestion: 'How does coordinate dilation from a center point create similar figures?',
          icon: '🔄',
          duration: '50 min',
          lessonUrl: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-3.5/',
          examUrl: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-3.5-exam/',
          lessonTitle: '📖 Lesson Explanation',
          examTitle: '📝 Module 3 Comprehensive Exam',
          content: {
            intro: 'A dilation is a non-rigid similarity transformation that enlarges or reduces a figure proportionally from a center point.',
            sections: [
              {
                title: 'Coordinate Rule for Dilation',
                type: 'formula',
                content: '(x, y) → (kx, ky)  with center at origin (0, 0)'
              },
              {
                title: 'Scale Factor Classification',
                type: 'bullets',
                content: [
                  'Enlargement: k > 1 (the image is larger than the preimage).',
                  'Reduction: 0 < k < 1 (the image is smaller than the preimage).',
                  'Isometry: k = 1 (congruent figure).'
                ]
              }
            ]
          }
        }
      ]
    },
    {
      id: 4,
      name: 'Module 4: Right Triangles and Trigonometry',
      icon: '📐',
      color: 'from-amber-500 to-orange-600',
      description: 'Master the geometric mean in right triangles, Pythagorean theorem and Pythagorean triples, special right triangles (45°-45°-90° and 30°-60°-90°), trigonometric ratios (SOH CAH TOA), angles of elevation and depression, and the Laws of Sines and Cosines.',
      lessons: [
        {
          id: 1,
          title: 'Lesson 4-1: Geometric Mean and Altitudes in Right Triangles',
          focusQuestion: 'How does the altitude to the hypotenuse create three similar right triangles?',
          icon: '📏',
          duration: '55 min',
          lessonUrl: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-4.1/',
          examUrl: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-4.1-exam/',
          lessonTitle: '📖 Lesson Explanation',
          examTitle: '📝 Module 4 Quiz 1',
          content: {
            intro: 'When an altitude is drawn from the right angle to the hypotenuse of a right triangle, it separates the triangle into two right triangles that are similar to each other and to the original triangle.',
            sections: [
              {
                title: 'Geometric Mean Definition',
                type: 'formula',
                content: 'The geometric mean x between two positive numbers a and b satisfies:\na / x = x / b  ⇒  x² = ab  ⇒  x = √(ab)'
              },
              {
                title: 'Geometric Mean Altitude and Leg Theorems',
                type: 'bullets',
                content: [
                  'Altitude Theorem: The altitude h is the geometric mean between the two segments of the hypotenuse x and y: h² = x · y  ⇒  h = √(xy).',
                  'Leg Theorem: Each leg is the geometric mean between the hypotenuse and the segment of the hypotenuse adjacent to that leg: a² = c · x and b² = c · y.'
                ]
              }
            ]
          }
        },
        {
          id: 2,
          title: 'Lesson 4-2: The Pythagorean Theorem and Its Converse',
          focusQuestion: 'How do Pythagorean triples and the converse classify acute, right, and obtuse triangles?',
          icon: '📐',
          duration: '50 min',
          lessonUrl: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-4.2/',
          examUrl: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-4.2-exam/',
          lessonTitle: '📖 Lesson Explanation',
          examTitle: '📝 Module 4 Quiz 2',
          content: {
            intro: 'The Pythagorean theorem relates the leg lengths and hypotenuse of any right triangle and allows triangle classification.',
            sections: [
              {
                title: 'The Pythagorean Theorem',
                type: 'formula',
                content: 'a² + b² = c²  (where c is the longest side / hypotenuse)'
              },
              {
                title: 'Pythagorean Triples',
                type: 'bullets',
                content: [
                  '(3, 4, 5) and multiples (6, 8, 10), (9, 12, 15)',
                  '(5, 12, 13) and multiples (10, 24, 26)',
                  '(8, 15, 17)',
                  '(7, 24, 25)'
                ]
              },
              {
                title: 'Converse and Triangle Classification',
                type: 'bullets',
                content: [
                  'If c² = a² + b²  ⇒  Right Triangle (90°)',
                  'If c² < a² + b²  ⇒  Acute Triangle (< 90°)',
                  'If c² > a² + b²  ⇒  Obtuse Triangle (> 90°)'
                ]
              }
            ]
          }
        },
        {
          id: 3,
          title: 'Lesson 4-3: Special Right Triangles (45°-45°-90° and 30°-60°-90°)',
          focusQuestion: 'What exact radical ratios define sides in 45°-45°-90° and 30°-60°-90° right triangles?',
          icon: '🔺',
          duration: '55 min',
          lessonUrl: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-4.3/',
          examUrl: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-4.3-exam/',
          lessonTitle: '📖 Lesson Explanation',
          examTitle: '📝 Module 4 Quiz 3',
          content: {
            intro: 'Special right triangles have constant side-length ratios, providing exact radical answers without requiring a calculator.',
            sections: [
              {
                title: '45°-45°-90° Triangle (Isosceles Right Triangle)',
                type: 'formula',
                content: 'Legs are equal: leg₁ = leg₂ = x\nHypotenuse = x√2\nRatio of sides: 1 : 1 : √2'
              },
              {
                title: '30°-60°-90° Triangle',
                type: 'formula',
                content: 'Shorter leg (opposite 30°) = x\nLonger leg (opposite 60°) = x√3\nHypotenuse (opposite 90°) = 2x\nRatio of sides: 1 : √3 : 2'
              }
            ]
          }
        },
        {
          id: 4,
          title: 'Lesson 4-4: Trigonometry and Trigonometric Ratios (SOH CAH TOA)',
          focusQuestion: 'How do sine, cosine, and tangent ratios compute unknown angles and lengths in right triangles?',
          icon: '📈',
          duration: '55 min',
          lessonUrl: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-4.4/',
          examUrl: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-4.4-exam/',
          lessonTitle: '📖 Lesson Explanation',
          examTitle: '📝 Module 4 Quiz 4',
          content: {
            intro: 'Trigonometry studies the relationships between the sides and angles of triangles.',
            sections: [
              {
                title: 'Core Trigonometric Ratios (SOH CAH TOA)',
                type: 'formula',
                content: 'sin(θ) = Opposite / Hypotenuse\ncos(θ) = Adjacent / Hypotenuse\ntan(θ) = Opposite / Adjacent = sin(θ) / cos(θ)'
              },
              {
                title: 'Inverse Trigonometric Ratios & Complementary Angles',
                type: 'bullets',
                content: [
                  'To find angle measures: θ = sin⁻¹(Opp/Hyp), θ = cos⁻¹(Adj/Hyp), θ = tan⁻¹(Opp/Adj).',
                  'Cofunction Identity: sin(θ) = cos(90° - θ) and cos(θ) = sin(90° - θ).'
                ]
              }
            ]
          }
        },
        {
          id: 5,
          title: 'Lesson 4-5: Angles of Elevation and Depression',
          focusQuestion: 'How do alternate interior angles equate angles of elevation and depression in real-world scenarios?',
          icon: '🔭',
          duration: '50 min',
          lessonUrl: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-4.5/',
          examUrl: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-4.5-exam/',
          lessonTitle: '📖 Lesson Explanation',
          examTitle: '📝 Module 4 Quiz 5',
          content: {
            intro: 'Angles of elevation and depression model line-of-sight observations in aviation, navigation, surveying, and physics.',
            sections: [
              {
                title: 'Definitions and Geometric Equivalence',
                type: 'bullets',
                content: [
                  'Angle of Elevation: The angle measured upward from the horizontal line of sight to an object.',
                  'Angle of Depression: The angle measured downward from the horizontal line of sight to an object.',
                  'Key Theorem: The angle of elevation from point A to point B equals the angle of depression from point B to point A (Alternate Interior Angles theorem between parallel horizontal lines).'
                ]
              }
            ]
          }
        },
        {
          id: 6,
          title: 'Lesson 4-6: The Law of Sines',
          focusQuestion: 'When can we apply the Law of Sines to solve non-right (oblique) triangles?',
          icon: '🌐',
          duration: '55 min',
          lessonUrl: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-4.6/',
          examUrl: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-4.6-exam/',
          lessonTitle: '📖 Lesson Explanation',
          examTitle: '📝 Module 4 Quiz 6',
          content: {
            intro: 'The Law of Sines extends trigonometry to any oblique triangle when given ASA, AAS, or SSA combinations.',
            sections: [
              {
                title: 'The Law of Sines Formula',
                type: 'formula',
                content: 'sin(A) / a = sin(B) / b = sin(C) / c'
              },
              {
                title: 'Area of Oblique Triangles',
                type: 'formula',
                content: 'Area = ½ a b sin(C) = ½ b c sin(A) = ½ a c sin(B)'
              },
              {
                title: 'The Ambiguous Case (SSA)',
                type: 'bullets',
                content: [
                  'Given two sides and a non-included angle, calculate altitude h = b sin(A).',
                  'If a < h: No triangle exists (0 solutions).',
                  'If a = h: Exactly one right triangle exists (1 solution).',
                  'If h < a < b: Two distinct triangles exist (2 solutions - acute and obtuse).',
                  'If a ≥ b: Exactly one triangle exists (1 solution).'
                ]
              }
            ]
          }
        },
        {
          id: 7,
          title: 'Lesson 4-7: The Law of Cosines',
          focusQuestion: 'How does the Law of Cosines solve SAS and SSS oblique triangles?',
          icon: '🎯',
          duration: '60 min',
          lessonUrl: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-4.7/',
          examUrl: 'https://mr-mohammed-hesham.github.io/10Adv-Bri-math-T1-2026-4.7-exam/',
          lessonTitle: '📖 Lesson Explanation',
          examTitle: '📝 Module 4 Comprehensive Final Exam',
          content: {
            intro: 'The Law of Cosines generalizes the Pythagorean theorem to any oblique triangle when two sides and the included angle (SAS) or all three sides (SSS) are known.',
            sections: [
              {
                title: 'The Law of Cosines Formulas',
                type: 'formula',
                content: 'a² = b² + c² - 2bc cos(A)\nb² = a² + c² - 2ac cos(B)\nc² = a² + b² - 2ab cos(C)'
              },
              {
                title: 'Solving for Angles (SSS case)',
                type: 'formula',
                content: 'cos(A) = (b² + c² - a²) / (2bc)\ncos(B) = (a² + c² - b²) / (2ac)\ncos(C) = (a² + b² - c²) / (2ab)'
              },
              {
                title: 'Problem-Solving Strategy',
                type: 'bullets',
                content: [
                  'Always find the largest angle first when solving SSS (the angle opposite the longest side) using the Law of Cosines.',
                  'This ensures remaining angles are acute, avoiding any ambiguity with the Law of Sines in subsequent steps.'
                ]
              }
            ]
          }
        }
      ]
    }
  ]
};
