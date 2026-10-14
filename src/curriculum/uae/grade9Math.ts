import { Curriculum } from "../../types";

export const math9AdvInspire1: Curriculum = {
  isEnglish: true,
  units: [
    {
      id: 1,
      name: "Unit 1: Linear Equations",
      icon: "📐",
      color: "from-blue-600 to-indigo-700",
      description: "Comprehensive study of writing and solving linear equations, one-step and multi-step equations, variables on both sides, absolute value equations, ratios, proportions, percent of change, literal equations, and weighted averages.",
      lessons: [
        {
          id: 1,
          title: "Lesson 1-1: Writing Equations",
          icon: "✍️",
          duration: "50 min",
          lessonUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-1.1/",
          examUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-1.1-exam/",
          lessonTitle: "📖 Lesson Explanation",
          examTitle: "📝 Take Quiz",
          content: {
            intro: "Translating verbal sentences and real-world problem statements into precise algebraic equations.",
            sections: [
              { title: "Key Operational Words", type: "bullets", content: [
                "Addition (+): sum, plus, increased by, more than",
                "Subtraction (-): difference, minus, decreased by, less than",
                "Multiplication (×): product, times, multiplied by, twice",
                "Division (÷): quotient, divided by, ratio of",
                "Equality (=): equals, is, is equal to, represents"
              ]},
              { title: "Formulas and Real-World Translations", type: "bullets", content: [
                "A number increased by 5 is 12: x + 5 = 12",
                "Twice a number decreased by 3 equals 7: 2x - 3 = 7",
                "Sum of two consecutive integers: n + (n + 1) = 2n + 1",
                "Perimeter of a rectangle: P = 2l + 2w"
              ]}
            ]
          }
        },
        {
          id: 2,
          title: "Lesson 1-2: Solving One-Step Equations",
          icon: "1️⃣",
          duration: "50 min",
          lessonUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-1.2/",
          examUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-1.2-exam/",
          lessonTitle: "📖 Lesson Explanation",
          examTitle: "📝 Take Quiz",
          content: {
            intro: "Solving equations by applying inverse operations using addition, subtraction, multiplication, or division properties of equality.",
            sections: [
              { title: "Addition and Subtraction Properties of Equality", type: "bullets", content: [
                "Addition Property: If a = b, then a + c = b + c",
                "Subtraction Property: If a = b, then a - c = b - c",
                "Example: x - 4 = 9 => x = 13",
                "Example: y + 7 = 15 => y = 8"
              ]},
              { title: "Multiplication and Division Properties of Equality", type: "bullets", content: [
                "Multiplication Property: If a = b, then a · c = b · c",
                "Division Property: If a = b and c ≠ 0, then a/c = b/c",
                "Example: 4x = 24 => x = 6",
                "Example: x/3 = -5 => x = -15"
              ]}
            ]
          }
        },
        {
          id: 3,
          title: "Lesson 1-3: Solving Multi-Step Equations",
          icon: "🔢",
          duration: "55 min",
          lessonUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-1.3/",
          examUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-1.3-exam/",
          lessonTitle: "📖 Lesson Explanation",
          examTitle: "📝 Take Quiz",
          content: {
            intro: "Solving equations requiring multiple operations, simplifying expressions with the distributive property, and combining like terms.",
            sections: [
              { title: "General Solution Algorithm", type: "bullets", content: [
                "1. Apply the Distributive Property to clear parentheses",
                "2. Combine like terms on each side of the equation",
                "3. Undo addition or subtraction using inverse operations",
                "4. Undo multiplication or division to isolate the variable"
              ]},
              { title: "Sample Problems", type: "bullets", content: [
                "3x + 7 = 22 => 3x = 15 => x = 5",
                "2(x - 3) + 4 = 16 => 2x - 6 + 4 = 16 => 2x - 2 = 16 => 2x = 18 => x = 9",
                "Consecutive integer problem: Find three consecutive integers whose sum is 48: n + (n+1) + (n+2) = 48 => 3n + 3 = 48 => n = 15"
              ]}
            ]
          }
        },
        {
          id: 4,
          title: "Lesson 1-4: Solving Equations with Variables on Each Side",
          icon: "⚖️",
          duration: "50 min",
          lessonUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-1.4/",
          examUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-1.4-exam/",
          lessonTitle: "📖 Lesson Explanation",
          examTitle: "📝 Take Quiz",
          content: {
            intro: "Collecting variable terms on one side of the equation and constants on the other, recognizing identities and no-solution cases.",
            sections: [
              { title: "Strategy", type: "bullets", content: [
                "Use addition or subtraction property to move variable terms to one side",
                "Move constant terms to the opposite side",
                "Solve for the variable"
              ]},
              { title: "Special Cases", type: "bullets", content: [
                "Identity (Infinite Solutions): 2(x + 3) = 2x + 6 => 6 = 6 (True for all real numbers)",
                "No Solution (Contradiction): 3x + 4 = 3x - 5 => 4 = -5 (False, empty set ∅)",
                "One Unique Solution: 5x - 2 = 2x + 10 => 3x = 12 => x = 4"
              ]}
            ]
          }
        },
        {
          id: 5,
          title: "Lesson 1-5: Solving Equations Involving Absolute Value",
          icon: "| |",
          duration: "55 min",
          lessonUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-1.5/",
          examUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-1.5-exam/",
          lessonTitle: "📖 Lesson Explanation",
          examTitle: "📝 Take Quiz",
          content: {
            intro: "The absolute value of a real number represents its distance from zero on the number line. Absolute value equations branch into two cases.",
            sections: [
              { title: "Definition and Cases", type: "bullets", content: [
                "For any real number a and c > 0: If |ax + b| = c, then ax + b = c OR ax + b = -c",
                "If |ax + b| = 0, then ax + b = 0",
                "If |ax + b| < 0 (negative), then the equation has NO solution"
              ]},
              { title: "Examples", type: "bullets", content: [
                "|x - 4| = 6 => x - 4 = 6 or x - 4 = -6 => x = 10 or x = -2",
                "2|x + 1| - 3 = 7 => 2|x + 1| = 10 => |x + 1| = 5 => x = 4 or x = -6",
                "Always check for extraneous solutions"
              ]}
            ]
          }
        },
        {
          id: 6,
          title: "Lesson 1-6: Ratios and Proportions",
          icon: "📊",
          duration: "50 min",
          lessonUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-1.6/",
          examUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-1.6-exam/",
          lessonTitle: "📖 Lesson Explanation",
          examTitle: "📝 Take Quiz",
          content: {
            intro: "A ratio is a comparison of two quantities. A proportion states that two ratios are equal, solved using cross products.",
            sections: [
              { title: "Cross Products Property", type: "formula", content: "\\text{If } \\frac{a}{b} = \\frac{c}{d} \\text{ (where } b, d \\neq 0\\text{), then } a \\cdot d = b \\cdot c" },
              { title: "Solving Proportions", type: "bullets", content: [
                "x / 5 = 3 / 15 => 15x = 15 => x = 1",
                "(x + 2) / 4 = 5 / 2 => 2(x + 2) = 20 => 2x + 4 = 20 => 2x = 16 => x = 8",
                "Unit rates and scale factors in geometric models"
              ]}
            ]
          }
        },
        {
          id: 7,
          title: "Lesson 1-7: Percent of Change",
          icon: "%",
          duration: "50 min",
          lessonUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-1.7/",
          examUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-1.7-exam/",
          lessonTitle: "📖 Lesson Explanation",
          examTitle: "📝 Take Quiz",
          content: {
            intro: "Calculating the ratio of the amount of change to the original amount expressed as a percent, distinguishing between percent increase and percent decrease.",
            sections: [
              { title: "Percent of Change Formula", type: "formula", content: "\\text{Percent of Change} = \\frac{|\\text{New Value} - \\text{Original Value}|}{\\text{Original Value}} \\times 100\\%" },
              { title: "Percent Increase vs Decrease", type: "bullets", content: [
                "If New > Original: Percent Increase",
                "If New < Original: Percent Decrease",
                "Discounts: Sale Price = Original Price × (1 - Discount Rate)",
                "Sales Tax / Markup: Total Price = Wholesale Price × (1 + Tax Rate)"
              ]}
            ]
          }
        },
        {
          id: 8,
          title: "Lesson 1-8: Literal Equations and Dimensional Analysis",
          icon: "🔤",
          duration: "55 min",
          lessonUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-1.8/",
          examUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-1.8-exam/",
          lessonTitle: "📖 Lesson Explanation",
          examTitle: "📝 Take Quiz",
          content: {
            intro: "Manipulating and rearranging formulas involving multiple variables to solve for a specific variable of interest.",
            sections: [
              { title: "Solving for a Variable", type: "bullets", content: [
                "Solve P = 2l + 2w for l: P - 2w = 2l => l = (P - 2w)/2",
                "Solve A = 1/2 · b · h for h: 2A = bh => h = 2A/b",
                "Solve d = r · t for r: r = d/t",
                "Solve C = 5/9(F - 32) for F: F = 9/5 C + 32"
              ]},
              { title: "Dimensional Analysis", type: "bullets", content: [
                "Using conversion factors to convert units of measure",
                "Multiplying by ratios equal to 1 to cancel unit dimensions",
                "Example: Convert 60 miles/hour to feet/second (88 ft/s)"
              ]}
            ]
          }
        },
        {
          id: 9,
          title: "Lesson 1-9: Weighted Averages",
          icon: "⚖️",
          duration: "50 min",
          lessonUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-1.9/",
          examUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-1.9-exam/",
          lessonTitle: "📖 Lesson Explanation",
          examTitle: "📝 Take Quiz",
          content: {
            intro: "Finding weighted averages in mixture problems, GPA calculations, and uniform motion problems.",
            sections: [
              { title: "Weighted Average Formula", type: "formula", content: "\\text{Weighted Average} = \\frac{\\sum (\\text{Value} \\times \\text{Weight})}{\\sum \\text{Weight}}" },
              { title: "Mixture Problems", type: "bullets", content: [
                "Two or more parts are combined into a whole",
                "Equation: (Price 1)(Amount 1) + (Price 2)(Amount 2) = (Total Price)(Total Amount)",
                "Percent concentration mixtures in science and finance"
              ]},
              { title: "Uniform Motion", type: "bullets", content: [
                "Distance = Rate × Time (d = rt)",
                "Objects traveling in opposite directions: d1 + d2 = Total Distance",
                "Objects traveling in the same direction overtaking: d1 = d2"
              ]}
            ]
          }
        }
      ]
    },
    {
      id: 2,
      name: "Unit 2: Linear Functions",
      icon: "📈",
      color: "from-emerald-600 to-teal-700",
      description: "Graphing linear equations, identifying intercepts, rate of change and slope, direct variation, arithmetic sequences as linear functions, and proportional vs nonproportional relationships.",
      lessons: [
        {
          id: 1,
          title: "Lesson 2-1: Graphing Linear Equations",
          icon: "📊",
          duration: "55 min",
          lessonUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-2.1/",
          examUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-2.1-exam/",
          lessonTitle: "📖 Lesson Explanation",
          examTitle: "📝 Take Quiz",
          content: {
            intro: "A linear equation can be written in standard form Ax + By = C and its graph is a straight line on the Cartesian plane.",
            sections: [
              { title: "Standard Form of a Linear Equation", type: "formula", content: "Ax + By = C \\quad (A \\geq 0, \\text{ and } A, B \\text{ not both zero})" },
              { title: "Finding Intercepts", type: "bullets", content: [
                "x-intercept: Set y = 0 and solve for x (point (x, 0))",
                "y-intercept: Set x = 0 and solve for y (point (0, y))",
                "Example: 2x + 3y = 12 => x-intercept is (6, 0), y-intercept is (0, 4)"
              ]}
            ]
          }
        },
        {
          id: 2,
          title: "Lesson 2-2: Solving Linear Equations by Graphing",
          icon: "📐",
          duration: "50 min",
          lessonUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-2.2/",
          examUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-2.2-exam/",
          lessonTitle: "📖 Lesson Explanation",
          examTitle: "📝 Take Quiz",
          content: {
            intro: "The root or solution of a linear equation in one variable is the x-intercept (also called the zero) of its related linear function.",
            sections: [
              { title: "Roots and Zeros", type: "bullets", content: [
                "Equation: 2x - 4 = 0",
                "Related function: f(x) = 2x - 4",
                "Zero of function: value of x for which f(x) = 0",
                "The graph intersects the x-axis at (2, 0), so the root is x = 2"
              ]}
            ]
          }
        },
        {
          id: 3,
          title: "Lesson 2-3: Rate of Change and Slope",
          icon: "📉",
          duration: "55 min",
          lessonUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-2.3/",
          examUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-2.3-exam/",
          lessonTitle: "📖 Lesson Explanation",
          examTitle: "📝 Take Quiz",
          content: {
            intro: "Rate of change describes how one quantity changes in relation to another. Slope is the ratio of vertical change (rise) to horizontal change (run).",
            sections: [
              { title: "Slope Formula", type: "formula", content: "m = \\frac{y_2 - y_1}{x_2 - x_1} \\quad (x_1 \\neq x_2)" },
              { title: "Four Types of Slope", type: "bullets", content: [
                "Positive slope: Line rises from left to right (m > 0)",
                "Negative slope: Line falls from left to right (m < 0)",
                "Zero slope: Horizontal line y = c (m = 0)",
                "Undefined slope: Vertical line x = c (denominator is 0)"
              ]}
            ]
          }
        },
        {
          id: 4,
          title: "Lesson 2-4: Direct Variation",
          icon: "∝",
          duration: "50 min",
          lessonUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-2.4/",
          examUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-2.4-exam/",
          lessonTitle: "📖 Lesson Explanation",
          examTitle: "📝 Take Quiz",
          content: {
            intro: "Direct variation is a relationship where the ratio of y to x is a nonzero constant k called the constant of variation.",
            sections: [
              { title: "Direct Variation Equation", type: "formula", content: "y = kx \\quad (k \\neq 0)" },
              { title: "Properties of Direct Variation", type: "bullets", content: [
                "The graph is always a straight line passing through the origin (0, 0)",
                "The slope of the line is equal to the constant of variation k",
                "Proportion setup: y1/x1 = y2/x2"
              ]}
            ]
          }
        },
        {
          id: 5,
          title: "Lesson 2-5: Arithmetic Sequences as Linear Functions",
          icon: "🔢",
          duration: "55 min",
          lessonUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-2.5/",
          examUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-2.5-exam/",
          lessonTitle: "📖 Lesson Explanation",
          examTitle: "📝 Take Quiz",
          content: {
            intro: "An arithmetic sequence is a numerical sequence in which the difference between successive terms is constant (common difference d).",
            sections: [
              { title: "nth Term of an Arithmetic Sequence", type: "formula", content: "a_n = a_1 + (n - 1)d" },
              { title: "Connection to Linear Functions", type: "bullets", content: [
                "The common difference d corresponds to the slope m of a linear function",
                "An arithmetic sequence is a discrete linear function whose domain is the set of positive integers",
                "Example: Sequence 3, 7, 11, 15,... has a1 = 3, d = 4 => an = 4n - 1"
              ]}
            ]
          }
        },
        {
          id: 6,
          title: "Lesson 2-6: Proportional and Nonproportional Relationships",
          icon: "📊",
          duration: "50 min",
          lessonUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-2.6/",
          examUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-2.6-exam/",
          lessonTitle: "📖 Lesson Explanation",
          examTitle: "📝 Take Quiz",
          content: {
            intro: "Distinguishing between proportional relationships (y = kx passing through origin) and nonproportional linear relationships (y = mx + b with b ≠ 0).",
            sections: [
              { title: "Proportional Relationships", type: "bullets", content: [
                "Constant ratio y/x for all points",
                "Graph is a straight line passing through (0, 0)",
                "Equation has form y = kx"
              ]},
              { title: "Nonproportional Relationships", type: "bullets", content: [
                "Ratio y/x is not constant",
                "Graph does not pass through the origin (y-intercept b ≠ 0)",
                "Equation has form y = mx + b"
              ]}
            ]
          }
        }
      ]
    },
    {
      id: 3,
      name: "Unit 3: Equations of Linear Functions",
      icon: "📐",
      color: "from-purple-600 to-indigo-700",
      description: "Writing and graphing equations in slope-intercept form and point-slope form, parallel and perpendicular lines, scatter plots, line of fit, inverse linear functions, and special functions.",
      lessons: [
        {
          id: 1,
          title: "Lesson 3-1: Graphing Equations in Slope-Intercept Form",
          icon: "📈",
          duration: "55 min",
          lessonUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-3.1/",
          examUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-3.1-exam/",
          lessonTitle: "📖 Lesson Explanation",
          examTitle: "📝 Take Quiz",
          content: {
            intro: "The slope-intercept form y = mx + b directly provides the slope m and the y-intercept b of a linear function.",
            sections: [
              { title: "Slope-Intercept Form", type: "formula", content: "y = mx + b" },
              { title: "Graphing Steps", type: "bullets", content: [
                "1. Plot the y-intercept (0, b)",
                "2. Use the slope m = rise/run to locate a second point",
                "3. Draw a straight line passing through both points",
                "Example: y = -3/4 x + 2 => Plot (0, 2), down 3, right 4 to (4, -1)"
              ]}
            ]
          }
        },
        {
          id: 2,
          title: "Lesson 3-2: Writing Equations in Slope-Intercept Form",
          icon: "✍️",
          duration: "50 min",
          lessonUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-3.2/",
          examUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-3.2-exam/",
          lessonTitle: "📖 Lesson Explanation",
          examTitle: "📝 Take Quiz",
          content: {
            intro: "Writing linear equations given the slope and a point, or given two points on the line.",
            sections: [
              { title: "Given Slope m and Point (x1, y1)", type: "bullets", content: [
                "Substitute m, x1, and y1 into y = mx + b to solve for b",
                "Rewrite the equation with m and the computed b",
                "Example: m = 2, point (3, 5) => 5 = 2(3) + b => b = -1 => y = 2x - 1"
              ]},
              { title: "Given Two Points", type: "bullets", content: [
                "1. Find slope using m = (y2 - y1) / (x2 - x1)",
                "2. Use either point to solve for b",
                "3. Write final equation in slope-intercept form"
              ]}
            ]
          }
        },
        {
          id: 3,
          title: "Lesson 3-3: Writing Equations in Point-Slope Form",
          icon: "📝",
          duration: "55 min",
          lessonUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-3.3/",
          examUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-3.3-exam/",
          lessonTitle: "📖 Lesson Explanation",
          examTitle: "📝 Take Quiz",
          content: {
            intro: "Point-slope form is derived directly from the definition of slope, allowing immediate equation writing from any point and slope.",
            sections: [
              { title: "Point-Slope Form", type: "formula", content: "y - y_1 = m(x - x_1)" },
              { title: "Standard and Slope-Intercept Conversion", type: "bullets", content: [
                "Distribute m to obtain slope-intercept form: y = mx + (y1 - mx1)",
                "Rearrange terms to obtain standard form: Ax + By = C",
                "Example: Pass through (-2, 4) with m = 3 => y - 4 = 3(x + 2) => y = 3x + 10"
              ]}
            ]
          }
        },
        {
          id: 4,
          title: "Lesson 3-4: Parallel and Perpendicular Lines",
          icon: "∥",
          duration: "50 min",
          lessonUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-3.4/",
          examUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-3.4-exam/",
          lessonTitle: "📖 Lesson Explanation",
          examTitle: "📝 Take Quiz",
          content: {
            intro: "Relationships between lines based on their slopes: parallel lines never intersect, perpendicular lines intersect at 90°.",
            sections: [
              { title: "Parallel Lines Criterion", type: "formula", content: "m_1 = m_2 \\quad (\\text{distinct nonvertical lines with identical slopes})" },
              { title: "Perpendicular Lines Criterion", type: "formula", content: "m_1 \\cdot m_2 = -1 \\iff m_2 = -\\frac{1}{m_1} \\quad (\\text{opposite reciprocals})" },
              { title: "Examples", type: "bullets", content: [
                "Line parallel to y = 4x - 1 passing through (2, 3): y - 3 = 4(x - 2) => y = 4x - 5",
                "Line perpendicular to y = -1/2 x + 4: slope is +2"
              ]}
            ]
          }
        },
        {
          id: 5,
          title: "Lesson 3-5: Scatter Plots and Lines of Fit",
          icon: "📊",
          duration: "55 min",
          lessonUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-3.5/",
          examUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-3.5-exam/",
          lessonTitle: "📖 Lesson Explanation",
          examTitle: "📝 Take Quiz",
          content: {
            intro: "Scatter plots reveal correlations between two variables, and lines of fit enable modeling and predicting future trends.",
            sections: [
              { title: "Correlation Types", type: "bullets", content: [
                "Positive correlation: As x increases, y tends to increase",
                "Negative correlation: As x increases, y tends to decrease",
                "No correlation: Points show no clear linear pattern"
              ]},
              { title: "Line of Fit", type: "bullets", content: [
                "A line drawn close to most points on a scatter plot",
                "Select two representative points on the line to find its equation",
                "Interpolation (predicting within data) and extrapolation (predicting outside data range)"
              ]}
            ]
          }
        },
        {
          id: 6,
          title: "Lesson 3-6: Inverse Linear Functions",
          icon: "↔️",
          duration: "50 min",
          lessonUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-3.6/",
          examUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-3.6-exam/",
          lessonTitle: "📖 Lesson Explanation",
          examTitle: "📝 Take Quiz",
          content: {
            intro: "An inverse relation interchanges input and output values. The inverse of a linear function f(x) is denoted f⁻¹(x).",
            sections: [
              { title: "Finding the Inverse Function Algebraically", type: "bullets", content: [
                "1. Replace f(x) with y: y = mx + b",
                "2. Interchange the roles of x and y: x = my + b",
                "3. Solve for y: y = (x - b)/m",
                "4. Replace y with f⁻¹(x): f⁻¹(x) = (x - b)/m"
              ]},
              { title: "Geometric Reflection Property", type: "bullets", content: [
                "The graph of f⁻¹(x) is the reflection of f(x) across the identity line y = x",
                "If (a, b) lies on f, then (b, a) lies on f⁻¹"
              ]}
            ]
          }
        },
        {
          id: 7,
          title: "Lesson 3-7: Special Functions",
          icon: "📐",
          duration: "50 min",
          lessonUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-3.7/",
          examUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-3.7-exam/",
          lessonTitle: "📖 Lesson Explanation",
          examTitle: "📝 Take Quiz",
          content: {
            intro: "Exploring piecewise-defined functions, step functions (greatest integer function), and absolute value functions.",
            sections: [
              { title: "Piecewise Functions", type: "bullets", content: [
                "Functions defined by different equations over different intervals of the domain",
                "Evaluating requires determining which interval the input x belongs to"
              ]},
              { title: "Absolute Value and Step Functions", type: "bullets", content: [
                "Absolute value function f(x) = |x|: V-shaped graph with vertex at (0, 0)",
                "Greatest integer function f(x) = ⟦x⟧: step/staircase graph, rounds down to largest integer ≤ x"
              ]}
            ]
          }
        }
      ]
    }
  ]
};

export const math9AdvBridge1: Curriculum = {
  isEnglish: false,
  units: [
    {
      id: 1,
      name: "الوحدة الأولى: المعادلات الخطية",
      icon: "📐",
      color: "from-blue-600 to-indigo-700",
      description: "دراسة شاملة لكتابة وحل المعادلات الخطية، معادلات الخطوة الواحدة ومتعددة الخطوات، متغير في كل طرف، معادلات القيمة المطلقة، النسب والتناسب، النسبة المئوية للتغيير، المعادلات الحرفية، والمتوسطات الحسابية الموزونة.",
      lessons: [
        {
          id: 1,
          title: "الدرس 1-1: كتابة المعادلات",
          icon: "✍️",
          duration: "50 min",
          lessonUrl: "https://mr-mohammed-hesham.github.io/9Adv-Bri-Math-T1-1.1/",
          examUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-1.1-exam/",
          lessonTitle: "📖 شرح الدرس",
          examTitle: "📝 اختبر نفسك",
          content: {
            intro: "نترجم العبارات والمسائل اللفظية الحياتية إلى معادلات جبرية دقيقة.",
            sections: [
              { title: "كلمات العمليات المفتاحية", type: "bullets", content: [
                "مجموع، زيادة، أكثر من: جمع (+)",
                "فرق، نقصان، أقل من: طرح (-)",
                "حاصل ضرب، أضعاف، أمثال: ضرب (×)",
                "حاصل قسمة، نسبة: قسمة (÷)",
                "يساوي، يصبح، يمثل، هو: مساواة (=)"
              ]},
              { title: "أمثلة وصيغ لفظية", type: "bullets", content: [
                "عدد زاد عليه 5 يساوي 12: x + 5 = 12",
                "ضعف عدد مطروحاً منه 3 يساوي 7: 2x - 3 = 7",
                "مجموع عددين صحيحين متتاليين: n + (n + 1)",
                "محيط المستطيل: P = 2l + 2w"
              ]}
            ]
          }
        },
        {
          id: 2,
          title: "الدرس 1-2: حل معادلات الخطوة الواحدة",
          icon: "1️⃣",
          duration: "50 min",
          lessonUrl: "https://mr-mohammed-hesham.github.io/9Adv-Bri-Math-T1-1.2/",
          examUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-1.2-exam/",
          lessonTitle: "📖 شرح الدرس",
          examTitle: "📝 اختبر نفسك",
          content: {
            intro: "حل المعادلات الجبرية بتطبيق العمليات العكسية باستخدام خصائص المساواة في الجمع والطرح والضرب والقسمة.",
            sections: [
              { title: "خاصيتا الجمع والطرح للمساواة", type: "bullets", content: [
                "خاصية الجمع: إذا كان a = b فإن a + c = b + c",
                "خاصية الطرح: إذا كان a = b فإن a - c = b - c",
                "مثال: x - 5 = 12 => x = 17 (بإضافة 5 للطرفين)",
                "مثال: y + 8 = 15 => y = 7 (بطرح 8 من الطرفين)"
              ]},
              { title: "خاصيتا الضرب والقسمة للمساواة", type: "bullets", content: [
                "خاصية الضرب: إذا كان a = b فإن ac = bc",
                "خاصية القسمة: إذا كان a = b و c ≠ 0 فإن a/c = b/c",
                "مثال: 3x = 18 => x = 6 (بالقسمة على 3)",
                "مثال: x/4 = 5 => x = 20 (بالضرب في 4)"
              ]}
            ]
          }
        },
        {
          id: 3,
          title: "الدرس 1-3: حل معادلات متعددة الخطوات",
          icon: "🔢",
          duration: "55 min",
          lessonUrl: "https://mr-mohammed-hesham.github.io/9Adv-Bri-Math-T1-1.3/",
          examUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-1.3-exam/",
          lessonTitle: "📖 شرح الدرس",
          examTitle: "📝 اختبر نفسك",
          content: {
            intro: "حل المعادلات التي تتطلب أكثر من عملية، وتبسيط المقادير الجبرية بخاصية التوزيع وجمع الحدود المتشابهة.",
            sections: [
              { title: "خطوات الحل المنهجية", type: "bullets", content: [
                "1. فك الأقواس باستخدام خاصية التوزيع إن وجدت",
                "2. تجميع الحدود المتشابهة في كل طرف",
                "3. التخلص من الجمع أو الطرح بنقل الثوابت",
                "4. التخلص من معامل المتغير بالضرب أو القسمة"
              ]},
              { title: "أمثلة تطبيقية", type: "bullets", content: [
                "2x + 5 = 13 => 2x = 8 => x = 4",
                "3(x - 2) + 4 = 19 => 3x - 6 + 4 = 19 => 3x - 2 = 19 => 3x = 21 => x = 7",
                "مسائل الأعداد المتتالية: ثلاثة أعداد فردية متتالية مجموعها 51 هي 15، 17، 19"
              ]}
            ]
          }
        },
        {
          id: 4,
          title: "الدرس 1-4: حل معادلات متغير في كل طرف",
          icon: "⚖️",
          duration: "50 min",
          lessonUrl: "https://mr-mohammed-hesham.github.io/9Adv-Bri-Math-T1-1.4/",
          examUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-1.4-exam/",
          lessonTitle: "📖 شرح الدرس",
          examTitle: "📝 اختبر نفسك",
          content: {
            intro: "تجميع الحدود المشتملة على المتغير في طرف واحد والثوابت في الطرف الآخر، مع تمييز حالات التطابق ولا يوجد حل.",
            sections: [
              { title: "استراتيجية الحل", type: "bullets", content: [
                "طرح أو إضافة حد المتغير الأصغر لنقله إلى الطرف الآخر",
                "نقل الحدود الثابتة للطرف المعاكس",
                "عزل المتغير وحساب قيمته"
              ]},
              { title: "الحالات الخاصة", type: "bullets", content: [
                "حل وحيد: 5x - 2 = 2x + 10 => 3x = 12 => x = 4",
                "متطابقة (عدد لا نهائي من الحلول): 3(x + 2) = 3x + 6 => 6 = 6 (صحيحة لجميع الأعداد الحقيقية R)",
                "مستحيلة الحل (المجموعة الخالية ∅): 2x + 5 = 2x - 1 => 5 = -1 (عبارة خاطئة)"
              ]}
            ]
          }
        },
        {
          id: 5,
          title: "الدرس 1-5: حل المعادلات التي تحتوي قيمة مطلقة",
          icon: "| |",
          duration: "55 min",
          lessonUrl: "https://mr-mohammed-hesham.github.io/9Adv-Bri-Math-T1-1.5/",
          examUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-1.5-exam/",
          lessonTitle: "📖 شرح الدرس",
          examTitle: "📝 اختبر نفسك",
          content: {
            intro: "القيمة المطلقة تمثل البعد عن نقطة الصفر على خط الأعداد وتكون دائماً غير سالبة، والمعادلة تتفرع لحالتين.",
            sections: [
              { title: "تعريف وقواعد القيمة المطلقة", type: "bullets", content: [
                "إذا كان |ax + b| = c (حيث c > 0) فإن: ax + b = c أو ax + b = -c",
                "إذا كان |ax + b| = 0 فإن: ax + b = 0",
                "إذا كان |ax + b| < 0 (سالب) فإن مجموعة الحل هي ∅ (مستحيلة الحل)"
              ]},
              { title: "أمثلة توضيحية", type: "bullets", content: [
                "|x - 3| = 5 => x - 3 = 5 أو x - 3 = -5 => x = 8 أو x = -2",
                "|2x + 1| = 9 => 2x + 1 = 9 أو 2x + 1 = -9 => x = 4 أو x = -5",
                "يجب التحقق دائماً للتأكد من عدم وجود حلول دخيلة"
              ]}
            ]
          }
        },
        {
          id: 6,
          title: "الدرس 1-6: النسب والتناسب",
          icon: "📊",
          duration: "50 min",
          lessonUrl: "https://mr-mohammed-hesham.github.io/9Adv-Bri-Math-T1-1.6/",
          examUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-1.6-exam/",
          lessonTitle: "📖 شرح الدرس",
          examTitle: "📝 اختبر نفسك",
          content: {
            intro: "النسبة هي مقارنة بين كميتين باستعمال القسمة. التناسب هو معادلة تبين أن نسبتين متساويتان، ونحله بالضرب التبادلي.",
            sections: [
              { title: "خاصية الضرب التبادلي", type: "formula", content: "\\text{إذا كان } \\frac{a}{b} = \\frac{c}{d} \\text{ فإن } ad = bc" },
              { title: "حل التناسبات", type: "bullets", content: [
                "x / 5 = 3 / 15 => 15x = 15 => x = 1",
                "(x + 2) / 4 = 5 / 2 => 2(x + 2) = 20 => 2x + 4 = 20 => x = 8",
                "معدلات الوحدة ومقاييس الرسم في الخرائط والمجسمات"
              ]}
            ]
          }
        },
        {
          id: 7,
          title: "الدرس 1-7: النسبة المئوية للتغيير",
          icon: "%",
          duration: "50 min",
          lessonUrl: "https://mr-mohammed-hesham.github.io/9Adv-Bri-Math-T1-1.7/",
          examUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-1.7-exam/",
          lessonTitle: "📖 شرح الدرس",
          examTitle: "📝 اختبر نفسك",
          content: {
            intro: "حساب النسبة المئوية للزيادة أو النقصان بالنسبة للقيمة الأصلية.",
            sections: [
              { title: "صيغة النسبة المئوية للتغيير", type: "formula", content: "\\text{النسبة المئوية} = \\frac{|\\text{القيمة الجديدة} - \\text{القيمة الأصلية}|}{\\text{القيمة الأصلية}} \\times 100\\%" },
              { title: "الزيادة والنقصان والتطبيقات المالية", type: "bullets", content: [
                "الزيادة المئوية: عندما تكون القيمة الجديدة أكبر من الأصلية",
                "النقصان المئوي: عندما تكون القيمة الجديدة أقل من الأصلية (كالخصم)",
                "حساب الخصم والضريبة وهامش الربح التجاري"
              ]}
            ]
          }
        },
        {
          id: 8,
          title: "الدرس 1-8: المعادلات الحرفية والتحليل البعدي",
          icon: "🔤",
          duration: "55 min",
          lessonUrl: "https://mr-mohammed-hesham.github.io/9Adv-Bri-Math-T1-1.8/",
          examUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-1.8-exam/",
          lessonTitle: "📖 شرح الدرس",
          examTitle: "📝 اختبر نفسك",
          content: {
            intro: "المعادلات الحرفية تشمل عدة متغيرات وقوانين فيزيائية وهندسية، ويتم حلها بعزل المتغير المستهدف.",
            sections: [
              { title: "حل المعادلات الحرفية لعزل متغير", type: "bullets", content: [
                "P = 2l + 2w أوجد l => 2l = P - 2w => l = (P - 2w)/2",
                "A = 1/2 b h أوجد h => 2A = bh => h = 2A/b",
                "d = rt أوجد t => t = d/r",
                "C = 5/9 (F - 32) أوجد F => F = 9/5 C + 32"
              ]},
              { title: "التحليل البعدي ومعاملات التحويل", type: "bullets", content: [
                "استخدام نسب التحويل بين وحدات القياس (كمية تساوي 1)",
                "حذف الأبعاد المتشابهة في البسط والمقام للوصول للوحدة المطلوبة"
              ]}
            ]
          }
        },
        {
          id: 9,
          title: "الدرس 1-9: المتوسط الحسابي الموزون",
          icon: "⚖️",
          duration: "50 min",
          lessonUrl: "https://mr-mohammed-hesham.github.io/9Adv-Bri-Math-T1-1.9/",
          examUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-1.9-exam/",
          lessonTitle: "📖 شرح الدرس",
          examTitle: "📝 اختبر نفسك",
          content: {
            intro: "المتوسط الموزون يأخذ في الاعتبار تباين أوزان وأهمية القيم في مسائل المخاليط ومسائل الحركة المنتظمة.",
            sections: [
              { title: "صيغة المتوسط الموزون", type: "formula", content: "\\text{المتوسط الموزون} = \\frac{\\sum (\\text{القيمة} \\times \\text{الوزن})}{\\sum \\text{الأوزان}}" },
              { title: "مسائل المخاليط والحركة", type: "bullets", content: [
                "خلط كميات بأسعار أو تراكيز مختلفة: السعر1 × الكمية1 + السعر2 × الكمية2 = السعر الإجمالي × الكمية الإجمالية",
                "الحركة المنتظمة: المسافة = السرعة × الزمن (d = rt)",
                "الحركة في اتجاهين متعاكسين أو في نفس الاتجاه لحساب نقطة الالتقاء"
              ]}
            ]
          }
        }
      ]
    },
    {
      id: 2,
      name: "الوحدة الثانية: الدوال الخطية",
      icon: "📈",
      color: "from-emerald-600 to-teal-700",
      description: "دراسة شاملة لتمثيل المعادلات الخطية بيانياً، إيجاد المقاطع السينية والصادية، حل المعادلات بالتمثيل البياني، معدل التغير والميل، التغير الطردي، المتتاليات الحسابية كدوال خطية، والعلاقات الخطية والتناسبية.",
      lessons: [
        {
          id: 1,
          title: "الدرس 2-1: تمثيل المعادلات الخطية بيانياً",
          icon: "📊",
          duration: "55 min",
          lessonUrl: "https://mr-mohammed-hesham.github.io/9Adv-Bri-Math-T1-2.1/",
          examUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-2.1-exam/",
          lessonTitle: "📖 شرح الدرس",
          examTitle: "📝 اختبر نفسك",
          content: {
            intro: "المعادلة الخطية تُمثل بخط مستقيم ويمكن كتابتها بالصورة القياسية Ax + By = C.",
            sections: [
              { title: "الصورة القياسية للمعادلة الخطية", type: "formula", content: "Ax + By = C \\quad (A \\geq 0, \\, A, B \\text{ ليسا كلاهما صفراً})" },
              { title: "إيجاد المقطعين السيني والصادي", type: "bullets", content: [
                "المقطع السيني (x-intercept): نضع y = 0 ونحل لإيجاد x (نقطة (x, 0))",
                "المقطع الصادي (y-intercept): نضع x = 0 ونحل لإيجاد y (نقطة (0, y))",
                "مثال: 2x + 3y = 12 => المقطع السيني هو 6 والمقطع الصادي هو 4"
              ]}
            ]
          }
        },
        {
          id: 2,
          title: "الدرس 2-2: حل المعادلات الخطية بالتمثيل البياني",
          icon: "📐",
          duration: "50 min",
          lessonUrl: "https://mr-mohammed-hesham.github.io/9Adv-Bri-Math-T1-2.2/",
          examUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-2.2-exam/",
          lessonTitle: "📖 شرح الدرس",
          examTitle: "📝 اختبر نفسك",
          content: {
            intro: "حل المعادلة الخطية بيانياً هو إيجاد نقطة تقاطع المستقيم مع محور السينات (صفر الدالة المرتبطة).",
            sections: [
              { title: "الجذور والأصفار", type: "bullets", content: [
                "المعادلة: 2x - 6 = 0",
                "الدالة المرتبطة: f(x) = 2x - 6",
                "صفر الدالة هو قيمة x التي تجعل f(x) = 0",
                "المستقيم يقطع محور السينات عند النقطة (3, 0)، إذن الحل هو x = 3"
              ]}
            ]
          }
        },
        {
          id: 3,
          title: "الدرس 2-3: معدل التغير والميل",
          icon: "📉",
          duration: "55 min",
          lessonUrl: "https://mr-mohammed-hesham.github.io/9Adv-Bri-Math-T1-2.3/",
          examUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-2.3-exam/",
          lessonTitle: "📖 شرح الدرس",
          examTitle: "📝 اختبر نفسك",
          content: {
            intro: "معدل التغير يقيس التغير في كمية بالنسبة لأخرى. الميل هو نسبة التغير الرأسي (التغير في y) إلى التغير الأفقي (التغير في x).",
            sections: [
              { title: "صيغة الميل", type: "formula", content: "m = \\frac{y_2 - y_1}{x_2 - x_1} \\quad (x_1 \\neq x_2)" },
              { title: "أنواع الميل الأربعة", type: "bullets", content: [
                "ميل موجب: المستقيم يصعد من اليسار لليمين",
                "ميل سالب: المستقيم يهبط من اليسار لليمين",
                "ميل صفري: مستقيم أفقي موازي لمحور السينات y = c",
                "ميل غير معرف: مستقيم رأسي موازي لمحور الصادات x = c"
              ]}
            ]
          }
        },
        {
          id: 4,
          title: "الدرس 2-4: التغير الطردي",
          icon: "∝",
          duration: "50 min",
          lessonUrl: "https://mr-mohammed-hesham.github.io/9Adv-Bri-Math-T1-2.4/",
          examUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-2.4-exam/",
          lessonTitle: "📖 شرح الدرس",
          examTitle: "📝 اختبر نفسك",
          content: {
            intro: "علاقة رياضية تكون فيها نسبة y إلى x ثابتة وتساوي ثابتاً غير صفري يُدعى ثابت التغير k.",
            sections: [
              { title: "معادلة التغير الطردي", type: "formula", content: "y = kx \\quad (k \\neq 0)" },
              { title: "خصائص التغير الطردي", type: "bullets", content: [
                "التمثيل البياني يمر دائماً بنقطة الأصل (0, 0)",
                "ميل المستقيم يساوي ثابت التغير k",
                "تناسب التغير الطردي: y1/x1 = y2/x2"
              ]}
            ]
          }
        },
        {
          id: 5,
          title: "الدرس 2-5: المتتاليات الحسابية كدوال خطية",
          icon: "🔢",
          duration: "55 min",
          lessonUrl: "https://mr-mohammed-hesham.github.io/9Adv-Bri-Math-T1-2.5/",
          examUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-2.5-exam/",
          lessonTitle: "📖 شرح الدرس",
          examTitle: "📝 اختبر نفسك",
          content: {
            intro: "المتتالية الحسابية نمط عددي يكون فيه الفرق بين كل حدين متتاليين ثابتاً ويُسمى الأساس d.",
            sections: [
              { title: "صيغة الحد النوني", type: "formula", content: "a_n = a_1 + (n - 1)d" },
              { title: "الربط بالدوال الخطية", type: "bullets", content: [
                "أساس المتتالية d يقابل ميل الدالة الخطية m",
                "المتتالية الحسابية هي دالة خطية مجالها مجموعة الأعداد الصحيحة الموجبة",
                "مثال: المتتالية 2، 5، 8، 11،... فيها a1 = 2 و d = 3 => an = 3n - 1"
              ]}
            ]
          }
        },
        {
          id: 6,
          title: "الدرس 2-6: العلاقات الخطية وغير الخطية",
          icon: "📊",
          duration: "50 min",
          lessonUrl: "https://mr-mohammed-hesham.github.io/9Adv-Bri-Math-T1-2.6/",
          examUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-2.6-exam/",
          lessonTitle: "📖 شرح الدرس",
          examTitle: "📝 اختبر نفسك",
          content: {
            intro: "التمييز بين العلاقات التناسبية المباشرة والعلاقات غير التناسبية واللاخطية.",
            sections: [
              { title: "العلاقات التناسبية", type: "bullets", content: [
                "المستقيم يمر بنقطة الأصل (0, 0)",
                "نسبة y/x ثابتة لجميع النقاط",
                "المعادلة بالصيغة y = kx"
              ]},
              { title: "العلاقات غير التناسبية واللاخطية", type: "bullets", content: [
                "العلاقة غير التناسبية لا تمر بنقطة الأصل (y = mx + b حيث b ≠ 0)",
                "العلاقة اللاخطية يتغير فيها معدل التغير ولا تمثل بخط مستقيم"
              ]}
            ]
          }
        }
      ]
    },
    {
      id: 3,
      name: "الوحدة الثالثة: معادلات الدوال الخطية",
      icon: "📐",
      color: "from-purple-600 to-indigo-700",
      description: "صيغ معادلات الدوال الخطية: صيغة الميل والمقطع، صيغة النقطة والميل، المستقيمات المتوازية والمتعامدة، مخططات التشتت وخطوط التواءمة، الدوال العكسية، والدوال الخاصة.",
      lessons: [
        {
          id: 1,
          title: "الدرس 3-1: تمثيل المعادلات بصيغة الميل والمقطع",
          icon: "📈",
          duration: "55 min",
          lessonUrl: "https://mr-mohammed-hesham.github.io/9Adv-Bri-Math-T1-3.1/",
          examUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-3.1-exam/",
          lessonTitle: "📖 شرح الدرس",
          examTitle: "📝 اختبر نفسك",
          content: {
            intro: "صيغة الميل والمقطع y = mx + b تمنحنا الميل m والمقطع الصادي b مباشرة لرسم المستقيم.",
            sections: [
              { title: "صيغة الميل والمقطع", type: "formula", content: "y = mx + b" },
              { title: "خطوات الرسم البياني", type: "bullets", content: [
                "1. عين نقطة المقطع الصادي (0, b)",
                "2. استعمل الميل m = التغير الرأسي / التغير الأفقي لتعيين نقطة ثانية",
                "3. ارسم مستقيماً يمر بالنقطتين",
                "مثال: y = 2x - 3 => نبدأ من (0, -3) ونصعد وحدتين ونتحرك يميناً وحدة إلى (1, -1)"
              ]}
            ]
          }
        },
        {
          id: 2,
          title: "الدرس 3-2: كتابة المعادلات بصيغة الميل والمقطع",
          icon: "✍️",
          duration: "50 min",
          lessonUrl: "https://mr-mohammed-hesham.github.io/9Adv-Bri-Math-T1-3.2/",
          examUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-3.2-exam/",
          lessonTitle: "📖 شرح الدرس",
          examTitle: "📝 اختبر نفسك",
          content: {
            intro: "كتابة المعادلة بمعلومية الميل ونقطة، أو بمعلومية نقطتين يمر بهما المستقيم.",
            sections: [
              { title: "بمعلومية الميل ونقطة (x1, y1)", type: "bullets", content: [
                "نعوض عن m و x و y في y = mx + b لحساب b",
                "نكتب المعادلة بالتعويض عن m و b",
                "مثال: m = 3 والنقطة (1, 5) => 5 = 3(1) + b => b = 2 => y = 3x + 2"
              ]},
              { title: "بمعلومية نقطتين", type: "bullets", content: [
                "1. نحسب الميل: m = (y2 - y1) / (x2 - x1)",
                "2. نعوض عن الميل وإحدى النقطتين لإيجاد b",
                "3. نكتب المعادلة النهائية"
              ]}
            ]
          }
        },
        {
          id: 3,
          title: "الدرس 3-3: كتابة المعادلات بصيغة النقطة والميل",
          icon: "📝",
          duration: "55 min",
          lessonUrl: "https://mr-mohammed-hesham.github.io/9Adv-Bri-Math-T1-3.3/",
          examUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-3.3-exam/",
          lessonTitle: "📖 شرح الدرس",
          examTitle: "📝 اختبر نفسك",
          content: {
            intro: "صيغة النقطة والميل مشتقة مباشرة من تعريف الميل وتستخدم لكتابة المعادلة بدقة وسرعة.",
            sections: [
              { title: "صيغة النقطة والميل", type: "formula", content: "y - y_1 = m(x - x_1)" },
              { title: "التحويل بين الصيغ المختلفة", type: "bullets", content: [
                "فك الأقواس والتبسيط للوصول إلى صيغة الميل والمقطع y = mx + b",
                "إعادة الترتيب للوصول إلى الصورة القياسية Ax + By = C",
                "مثال: يمر بالنقطة (-1, 4) وميله 2 => y - 4 = 2(x + 1) => y = 2x + 6"
              ]}
            ]
          }
        },
        {
          id: 4,
          title: "الدرس 3-4: المستقيمات المتوازية والمتعامدة",
          icon: "∥",
          duration: "50 min",
          lessonUrl: "https://mr-mohammed-hesham.github.io/9Adv-Bri-Math-T1-3.4/",
          examUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-3.4-exam/",
          lessonTitle: "📖 شرح الدرس",
          examTitle: "📝 اختبر نفسك",
          content: {
            intro: "تحديد التوازي والتعامد بين المستقيمات اعتماداً على ميولها.",
            sections: [
              { title: "شرط المستقيمات المتوازية", type: "formula", content: "m_1 = m_2 \\quad (\\text{لهما نفس الميل ومقاطع صادية مختلفة})" },
              { title: "شرط المستقيمات المتعامدة", type: "formula", content: "m_1 \\times m_2 = -1 \\iff m_2 = -\\frac{1}{m_1} \\quad (\\text{حاصل ضرب ميلهما } -1)" },
              { title: "أمثلة تطبيقية", type: "bullets", content: [
                "المستقيم الموازي لـ y = 3x - 1 له ميل يساوي 3",
                "المستقيم العمودي على y = 2x + 5 له ميل يساوي -1/2",
                "المستقيمات الأفقية (m = 0) والعمودية (m غير معرف) متعامدة دائماً"
              ]}
            ]
          }
        },
        {
          id: 5,
          title: "الدرس 3-5: الانحدار ومستقيمات التواءمة الوسطية",
          icon: "📊",
          duration: "55 min",
          lessonUrl: "https://mr-mohammed-hesham.github.io/9Adv-Bri-Math-T1-3.5/",
          examUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-3.5-exam/",
          lessonTitle: "📖 شرح الدرس",
          examTitle: "📝 اختبر نفسك",
          content: {
            intro: "مخططات التشتت تبين طبيعة الارتباط بين المتغيرين، وخط التواءمة الأفضل يتيح النمذجة والتنبؤ.",
            sections: [
              { title: "أنواع الارتباط", type: "bullets", content: [
                "ارتباط موجب: بزيادة x تزداد y عموماً",
                "ارتباط سالب: بزيادة x تنقص y عموماً",
                "لا يوجد ارتباط: انتشار النقاط عشوائياً دون نمط"
              ]},
              { title: "خط التواءمة الأفضل والتنبؤ", type: "bullets", content: [
                "مستقيم يمر بالقرب من أكبر عدد من النقاط ويتوسطها",
                "اختيار نقطتين على الخط وحساب معادلته للتنبؤ بالقيم المستقبلية"
              ]}
            ]
          }
        },
        {
          id: 6,
          title: "الدرس 3-6: الدوال الخطية العكسية",
          icon: "↔️",
          duration: "50 min",
          lessonUrl: "https://mr-mohammed-hesham.github.io/9Adv-Bri-Math-T1-3.6/",
          examUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-3.6-exam/",
          lessonTitle: "📖 شرح الدرس",
          examTitle: "📝 اختبر نفسك",
          content: {
            intro: "الدالة العكسية تعكس مدخلات ومخرجات الدالة الأصلية، ويُرمز لمعكوس f(x) بالرمز f⁻¹(x).",
            sections: [
              { title: "خطوات إيجاد الدالة العكسية جبرياً", type: "bullets", content: [
                "1. نكتب y بدلاً من f(x): y = 2x + 4",
                "2. نبدل موقعي المتغيرين x و y: x = 2y + 4",
                "3. نحل المعادلة لعزل y: 2y = x - 4 => y = (x - 4)/2",
                "4. نكتب f⁻¹(x) = (x - 4)/2"
              ]},
              { title: "الخاصية الهندسية", type: "bullets", content: [
                "منحنى f⁻¹(x) هو انعكاس لمنحنى f(x) حول مستقيم التطابق y = x",
                "إذا كانت النقطة (a, b) تقع على f فإن النقطة (b, a) تقع على f⁻¹"
              ]}
            ]
          }
        },
        {
          id: 7,
          title: "الدرس 3-7: الدوال الخطية الخاصة",
          icon: "📐",
          duration: "50 min",
          lessonUrl: "https://mr-mohammed-hesham.github.io/9Adv-Bri-Math-T1-3.7/",
          examUrl: "https://mr-mohammed-hesham.github.io/9Adv-Rev-Math-T1-3.7-exam/",
          lessonTitle: "📖 شرح الدرس",
          examTitle: "📝 اختبر نفسك",
          content: {
            intro: "دراسة الدوال متعددة التعريف، الدالة الدرجية (أكبر عدد صحيح)، ودالة القيمة المطلقة.",
            sections: [
              { title: "الدوال متعددة التعريف", type: "bullets", content: [
                "دوال تُعرّف بقواعد مختلفة على فترات مختلفة من مجالها",
                "تحديد الفترة المناسبة للتعويض وحساب قيمة الدالة"
              ]},
              { title: "دالة القيمة المطلقة والدالة الدرجية", type: "bullets", content: [
                "دالة القيمة المطلقة f(x) = |x|: رسم بياني على شكل V برأس عند نقطة الأصل",
                "دالة أكبر عدد صحيح f(x) = ⟦x⟧: رسم بياني درجى يقرب لأكبر عدد صحيح أقل من أو يساوي x"
              ]}
            ]
          }
        }
      ]
    }
  ]
};
