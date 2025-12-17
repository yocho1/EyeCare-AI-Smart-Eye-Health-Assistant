"""Learning module content and quiz management."""
from typing import List, Dict, Any
from app.schemas import LearningModule, QuizResult


class LearningService:
    """Service for managing learning content."""
    
    # Learning modules database
    MODULES = {
        "eyes_101": {
            "id": "eyes_101",
            "title": "Eyes 101: How Your Eyes Work",
            "description": "Learn the basics of eye anatomy and how vision works.",
            "content": """
## How Your Eyes Work

Your eyes are amazing organs that allow you to see the world around you!

### Main Parts:
1. **Cornea**: The clear front layer that focuses light
2. **Lens**: Adjusts focus for near and far objects
3. **Retina**: Contains light-sensitive cells that send signals to your brain
4. **Optic Nerve**: Carries visual information to your brain

### The Vision Process:
1. Light enters through the cornea
2. Light passes through the lens which focuses it
3. Light hits the retina at the back of the eye
4. Retina cells convert light into signals
5. Signals travel via optic nerve to your brain
6. Brain interprets the signals and you see!

### Fun Facts:
- Your eyes can see in color, black and white, and even in very dim light
- Your eyes move about 100,000 times per day
- The muscles in your eyes are the most active muscles in your body
""",
            "quiz_questions": [
                {
                    "question": "Which part of the eye focuses light?",
                    "options": ["Cornea", "Retina", "Iris", "Optic Nerve"],
                    "correct": 0
                },
                {
                    "question": "What is the optic nerve responsible for?",
                    "options": ["Focusing light", "Carrying visual signals to the brain", "Adjusting pupil size", "Protecting the eye"],
                    "correct": 1
                }
            ]
        },
        "digital_eye_strain": {
            "id": "digital_eye_strain",
            "title": "Digital Eye Strain: Prevention Tips",
            "description": "Understand and prevent eye strain from screen use.",
            "content": """
## Digital Eye Strain (Computer Vision Syndrome)

Many people experience discomfort when using screens. This is called digital eye strain.

### Why It Happens:
- When looking at screens, we blink 66% less than normal
- Our eyes focus at the same distance for long periods
- Screens emit blue light which can strain eyes
- Poor posture and lighting make it worse

### Common Symptoms:
- Dry, irritated eyes
- Blurred vision
- Headaches
- Neck and shoulder pain
- Eye fatigue

### Prevention Strategies:

#### The 20-20-20 Rule ⭐
**Every 20 minutes, look at something 20 feet away for 20 seconds**

This is THE most important rule for digital eye health!

#### Proper Workspace Setup:
- Position screen 20-24 inches from your eyes
- Top of screen at or slightly below eye level
- Reduce glare by adjusting lighting or screen angle
- Maintain good posture (shoulders relaxed, back straight)

#### Screen Settings:
- Increase font size if text is too small
- Use high contrast between text and background
- Enable dark mode in the evening
- Reduce brightness to match surroundings

#### Eye Care Habits:
- Blink deliberately and often
- Keep eyes moist (use artificial tears if needed)
- Take regular breaks away from screens
- Stay hydrated (drink water throughout the day)
""",
            "quiz_questions": [
                {
                    "question": "How many times less do we blink when using screens?",
                    "options": ["25% less", "50% less", "66% less", "80% less"],
                    "correct": 2
                },
                {
                    "question": "What should you do every 20 minutes (20-20-20 rule)?",
                    "options": ["Close your eyes", "Look 20 feet away for 20 seconds", "Drink 20ml of water", "Blink 20 times"],
                    "correct": 1
                }
            ]
        },
        "lighting_guide": {
            "id": "lighting_guide",
            "title": "Proper Lighting for Eye Comfort",
            "description": "Learn how to optimize lighting for reading and screen use.",
            "content": """
## Lighting and Eye Comfort

Good lighting is crucial for eye comfort and overall vision quality.

### Types of Lighting:

#### Ambient Lighting
- General room brightness
- Should be 3-4 times the brightness of your screen
- Prevents contrast stress on your eyes

#### Task Lighting
- Direct light focused on what you're reading/working on
- Prevents the need for excessive brightness
- Should come from behind or beside you (not overhead)

#### Natural Light
- Best for eye health
- Provides full spectrum light
- Position workspace near windows when possible
- Avoid direct sunlight on screens (causes glare)

### Common Lighting Problems:

#### Glare:
- Caused by light reflecting off surfaces
- Reduces contrast and visibility
- Solutions: Position screen away from windows, use matte screens, adjust lamp angles

#### Insufficient Lighting:
- Strains eyes due to constant focusing effort
- Solutions: Add task lighting, move closer to light source, increase screen brightness moderately

#### Excessive Brightness:
- Can cause discomfort and headaches
- Solutions: Reduce screen brightness, use anti-glare screen protector

### Ideal Setup:
1. Soft ambient lighting throughout the room
2. Task lighting that doesn't create glare
3. Screen positioned perpendicular to windows
4. Brightness adjusted to match surroundings
5. No direct light sources in your field of view

### Color Temperature:
- **Warm light (2700K)**: Evening/relaxation - reduces blue light
- **Cool light (4000-5000K)**: Daytime/work - closer to natural daylight
- Use warm light 1-2 hours before bedtime to improve sleep
""",
            "quiz_questions": [
                {
                    "question": "Ideal ambient lighting should be how many times brighter than your screen?",
                    "options": ["1-2 times", "3-4 times", "5-6 times", "10+ times"],
                    "correct": 1
                }
            ]
        },
        "break_importance": {
            "id": "break_importance",
            "title": "Why Breaks Matter for Eye Health",
            "description": "Understand the importance of regular breaks.",
            "content": """
## The Power of Breaks

Taking breaks is not a luxury—it's essential for eye health!

### What Happens During Long Focus Sessions:
- Eye muscles become fatigued (just like any muscle)
- Accommodation (focusing ability) decreases
- Blink rate drops
- Eyes become dry and irritated
- Overall vision becomes less sharp

### Benefits of Regular Breaks:
1. **Muscle Recovery**: Eye muscles relax and reset
2. **Tear Production**: Eyes re-hydrate
3. **Mental Refreshment**: Reduces mental fatigue
4. **Better Focus**: When you return, you focus better
5. **Improved Posture**: Prevents neck and back pain

### Break Guidelines:

#### Frequent Micro-Breaks:
- Every 20 minutes: 20-second break (20-20-20 rule)
- Look away from screen
- Allow eyes to relax naturally

#### Regular Breaks:
- Every 1-2 hours: 5-10 minute break
- Get up and walk
- Do light stretching
- Get some distance from screens

#### Longer Breaks:
- Every 4 hours: 15-30 minute break
- Go outside (natural light is best)
- Do activities that don't require screen use
- Eat a healthy snack

### Break Activities:
✓ Look out a window
✓ Walk around
✓ Stretch (neck, shoulders, back)
✓ Close eyes and rest
✓ Play a non-screen game
✓ Hydrate with water
✓ Do light exercises

### Remote Work Tips:
- Set timers as reminders
- Use break apps (like 20-20-20 timers)
- Move your desk to vary scenery
- Take lunch breaks away from your desk
""",
            "quiz_questions": [
                {
                    "question": "What is the 20-20-20 rule?",
                    "options": [
                        "Take 20 breaks of 20 minutes",
                        "Every 20 minutes, look 20 feet away for 20 seconds",
                        "Every 20 hours, rest for 20 minutes",
                        "Use 20 glasses of water per day"
                    ],
                    "correct": 1
                }
            ]
        }
    }
    
    @staticmethod
    def get_all_modules() -> List[LearningModule]:
        """Get all learning modules."""
        modules = []
        for module_id, module_data in LearningService.MODULES.items():
            modules.append(LearningModule(**module_data))
        return modules
    
    @staticmethod
    def get_module(module_id: str) -> LearningModule:
        """Get a specific module by ID."""
        if module_id not in LearningService.MODULES:
            raise ValueError(f"Module {module_id} not found")
        
        module_data = LearningService.MODULES[module_id]
        return LearningModule(**module_data)
    
    @staticmethod
    def check_quiz(
        module_id: str,
        answers: List[int]
    ) -> QuizResult:
        """Check quiz answers and return result."""
        if module_id not in LearningService.MODULES:
            raise ValueError(f"Module {module_id} not found")
        
        module = LearningService.MODULES[module_id]
        questions = module.get("quiz_questions", [])
        
        if not questions:
            raise ValueError(f"Module {module_id} has no quiz")
        
        if len(answers) != len(questions):
            raise ValueError("Number of answers must match number of questions")
        
        # Calculate score
        correct = 0
        for i, answer in enumerate(answers):
            if answer == questions[i]["correct"]:
                correct += 1
        
        score = int((correct / len(questions)) * 100)
        passed = score >= 70
        
        feedback = ""
        if score == 100:
            feedback = "Perfect score! You've mastered this topic. 🌟"
        elif score >= 80:
            feedback = "Great job! You understand this topic well. Keep it up!"
        elif score >= 70:
            feedback = "Good effort! You've passed. Consider reviewing the material for a better understanding."
        else:
            feedback = "Keep learning! Review the material and try again."
        
        return QuizResult(
            module_id=module_id,
            score=score,
            passed=passed,
            feedback=feedback
        )
