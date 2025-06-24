/**
 * Story structure templates for deep plotting extension
 */

export const plotTemplates = {
    threeAct: {
        name: "Three-Act Structure",
        description: "Classic three-act structure for storytelling",
        acts: [
            {
                name: "Act 1: Setup",
                description: "Introduce the characters, world and establish the central conflict",
                stages: [
                    { name: "Exposition", description: "Introduce the main character and their normal world" },
                    { name: "Inciting Incident", description: "Event that sets the story in motion" },
                    { name: "Plot Point 1", description: "The protagonist commits to addressing the central conflict" }
                ]
            },
            {
                name: "Act 2: Confrontation",
                description: "The protagonist faces obstacles in addressing the central conflict",
                stages: [
                    { name: "Rising Action", description: "Protagonist attempts to resolve the conflict but faces complications" },
                    { name: "Midpoint", description: "A turning point that raises the stakes" },
                    { name: "Setback", description: "The protagonist faces their lowest point" }
                ]
            },
            {
                name: "Act 3: Resolution",
                description: "The conflict reaches its climax and is resolved",
                stages: [
                    { name: "Pre-climax", description: "The protagonist prepares for the final confrontation" },
                    { name: "Climax", description: "The final confrontation with the antagonistic force" },
                    { name: "Resolution", description: "The new normal after the conflict is resolved" }
                ]
            }
        ]
    },

    heroJourney: {
        name: "Hero's Journey",
        description: "Campbell's monomyth structure for character-driven stories",
        acts: [
            {
                name: "Departure",
                description: "The hero leaves the familiar world",
                stages: [
                    { name: "Ordinary World", description: "The hero's normal life before the adventure" },
                    { name: "Call to Adventure", description: "The hero is presented with a challenge or quest" },
                    { name: "Refusal of the Call", description: "The hero initially refuses the challenge" },
                    { name: "Meeting the Mentor", description: "The hero gains guidance from a mentor figure" },
                    { name: "Crossing the Threshold", description: "The hero commits to the adventure" }
                ]
            },
            {
                name: "Initiation",
                description: "The hero faces challenges and transforms",
                stages: [
                    { name: "Tests, Allies, Enemies", description: "The hero faces tests, makes allies and enemies" },
                    { name: "Approach to the Inmost Cave", description: "The hero prepares for the major challenge" },
                    { name: "Ordeal", description: "The hero faces their greatest fear or challenge" },
                    { name: "Reward", description: "The hero seizes the prize they sought" }
                ]
            },
            {
                name: "Return",
                description: "The hero returns transformed",
                stages: [
                    { name: "The Road Back", description: "The hero begins the journey home" },
                    { name: "Resurrection", description: "The hero faces a final test" },
                    { name: "Return with the Elixir", description: "The hero returns with something to benefit the ordinary world" }
                ]
            }
        ]
    },

    fiveAct: {
        name: "Five-Act Structure",
        description: "Expanded dramatic structure for complex narratives",
        acts: [
            {
                name: "Act 1: Exposition",
                description: "Set up the world and characters",
                stages: [
                    { name: "Introduction", description: "Introduce the main characters and setting" },
                    { name: "Inciting Incident", description: "The event that sets the story in motion" }
                ]
            },
            {
                name: "Act 2: Rising Action",
                description: "Complications arise",
                stages: [
                    { name: "Complication", description: "The protagonist faces initial obstacles" },
                    { name: "Development", description: "The conflict develops and intensifies" }
                ]
            },
            {
                name: "Act 3: Climax",
                description: "The turning point of the story",
                stages: [
                    { name: "Crisis", description: "The protagonist faces a major crisis" },
                    { name: "Climax", description: "The turning point that determines the protagonist's fate" }
                ]
            },
            {
                name: "Act 4: Falling Action",
                description: "The consequences of the climax",
                stages: [
                    { name: "Reversal", description: "The results of the climax affect the characters" },
                    { name: "Falling Action", description: "Events leading to the resolution" }
                ]
            },
            {
                name: "Act 5: Resolution",
                description: "The conclusion of the story",
                stages: [
                    { name: "Resolution", description: "The conflict is resolved" },
                    { name: "Denouement", description: "Final outcome for the characters" }
                ]
            }
        ]
    },

    saveTheCat: {
        name: "Save the Cat",
        description: "Blake Snyder's 15-beat screenplay structure",
        acts: [
            {
                name: "Act 1: Setup",
                description: "Establish the world and character",
                stages: [
                    { name: "Opening Image", description: "Sets the tone and initial situation" },
                    { name: "Theme Stated", description: "What the story is really about" },
                    { name: "Setup", description: "Introduce characters and their flaws" },
                    { name: "Catalyst", description: "The inciting incident that disrupts the status quo" },
                    { name: "Debate", description: "The character doubts whether to proceed" },
                    { name: "Break into Two", description: "The character makes a choice to enter Act 2" }
                ]
            },
            {
                name: "Act 2: Confrontation",
                description: "The character faces escalating challenges",
                stages: [
                    { name: "B Story", description: "A secondary story or relationship begins" },
                    { name: "Fun and Games", description: "The 'promise of the premise'" },
                    { name: "Midpoint", description: "Raises the stakes, either up or down" },
                    { name: "Bad Guys Close In", description: "External and internal pressures increase" },
                    { name: "All Is Lost", description: "The lowest point for the protagonist" },
                    { name: "Dark Night of the Soul", description: "The character's moment of despair" },
                    { name: "Break into Three", description: "The character finds the solution" }
                ]
            },
            {
                name: "Act 3: Resolution",
                description: "The climax and resolution",
                stages: [
                    { name: "Finale", description: "The character applies the lessons learned" },
                    { name: "Final Image", description: "Mirror of the opening image, showing change" }
                ]
            }
        ]
    }
};

export const characterArcTemplates = {
    heroicArc: {
        name: "Heroic Character Arc",
        description: "A character grows from weakness to strength",
        stages: [
            { name: "Limitation", description: "Character has a flaw or limitation" },
            { name: "Desire", description: "Character wants something" },
            { name: "First Action", description: "Character takes action toward goal" },
            { name: "Conflict", description: "Character faces opposition" },
            { name: "Growth", description: "Character begins to change" },
            { name: "Revelation", description: "Character has a realization" },
            { name: "Transformation", description: "Character overcomes limitation" }
        ]
    },

    fallArc: {
        name: "Tragic Fall Arc",
        description: "A character falls from grace",
        stages: [
            { name: "Status", description: "Character has position or virtue" },
            { name: "Temptation", description: "Character faces a temptation" },
            { name: "Rationalization", description: "Character justifies giving in" },
            { name: "Descent", description: "Character begins moral decline" },
            { name: "Point of No Return", description: "Character crosses a moral line" },
            { name: "Consequences", description: "Character faces the results of actions" },
            { name: "Ruin", description: "Character's fall is complete" }
        ]
    },

    redemptionArc: {
        name: "Redemption Arc",
        description: "A character redeems themselves after a fall",
        stages: [
            { name: "Establishment", description: "Character is established as flawed" },
            { name: "Inciting Event", description: "Something forces character to confront flaws" },
            { name: "Resistance", description: "Character resists change" },
            { name: "Turning Point", description: "Character begins to accept need to change" },
            { name: "Growth", description: "Character works to change" },
            { name: "Setback", description: "Character faces a test of resolve" },
            { name: "Redemption", description: "Character achieves redemption" }
        ]
    },

    flatArc: {
        name: "Flat Character Arc",
        description: "A character remains steadfast and changes the world",
        stages: [
            { name: "Truth", description: "Character already knows a fundamental truth" },
            { name: "Challenge", description: "World challenges character's truth" },
            { name: "Test", description: "Character's belief is tested" },
            { name: "Resistance", description: "Others resist character's truth" },
            { name: "Perseverance", description: "Character maintains belief despite opposition" },
            { name: "Influence", description: "Character begins to influence others" },
            { name: "Vindication", description: "Character's truth is proven right" }
        ]
    }
};

export default {
    plotTemplates,
    characterArcTemplates
};
