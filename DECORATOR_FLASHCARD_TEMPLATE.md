# 📚 Decorator Fundamentals - Flashcard Templates

Ready-to-use markdown-formatted flashcards for learning Python decorators. Copy-paste these directly into your flashcard system!

---

## Flash Card 1: Core Concept

### Front:
```
What is a Python decorator and what problem does it solve?
```

### Back:
```
**Definition:** A decorator is a function that takes another function and extends its behavior without permanently modifying it.

**Problem it solves:** Adding cross-cutting concerns (logging, timing, caching, validation) without cluttering business logic.

**Key mechanism:** Uses closures—inner functions that "remember" variables from their enclosing scope.

**Visual memory:** 🎁 A gift wrapper that adds features while keeping the gift inside unchanged.

---

**Why it matters:** Decorators are fundamental to advanced Python (Flask routes, property decorators, etc.)
```

---

## Flash Card 2: Basic Syntax Pattern

### Front:
```
Write the skeleton code for a basic decorator. What are the 3 essential parts?
```

### Back:
```
**3 Essential Parts:**

```python
# 1. OUTER FUNCTION (takes function as argument)
def my_decorator(func):
    # 2. INNER FUNCTION (closure - wrapper)
    def wrapper(*args, **kwargs):
        # Do something before
        print("Before calling function")
        
        # Call the original function
        result = func(*args, **kwargs)
        
        # Do something after
        print("After calling function")
        return result
    
    # 3. RETURN wrapper (not the original function)
    return wrapper
```

**Usage:**
```python
@my_decorator  # Syntactic sugar
def greet(name):
    return f"Hello, {name}!"

# Equivalent to:
# greet = my_decorator(greet)
```

**Memory trigger:** "Take (input) → Wrap → Return (wrapper)"

**Critical detail:** `*args, **kwargs` makes it work with ANY function signature
```

---

## Flash Card 3: Common Gotcha - Metadata Loss

### Front:
```
What metadata does a decorated function lose, and how do you fix it?
```

### Back:
```
**The Problem:**

```python
def timer(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        elapsed = time.time() - start
        print(f"Elapsed: {elapsed}s")
        return result
    return wrapper

@timer
def calculate(x):
    """Calculates x * 2"""
    return x * 2

print(calculate.__name__)   # Prints: "wrapper" ❌ WRONG!
print(calculate.__doc__)    # Prints: None ❌ WRONG!
```

**Why it breaks debugging:** Stack traces show `wrapper` instead of `calculate`

**The Solution: @functools.wraps**

```python
import functools

def timer(func):
    @functools.wraps(func)  # ← THIS IS THE FIX
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        elapsed = time.time() - start
        print(f"Elapsed: {elapsed}s")
        return result
    return wrapper

@timer
def calculate(x):
    """Calculates x * 2"""
    return x * 2

print(calculate.__name__)   # Prints: "calculate" ✅ CORRECT!
print(calculate.__doc__)    # Prints: "Calculates x * 2" ✅ CORRECT!
```

**Interview signal:** Knowing this shows production experience—debugging is impossible without proper metadata.

**Memory trigger:** "Wrap the wrapper with @functools.wraps"

**Metadata preserved:**
- `__name__` - Function name
- `__doc__` - Docstring
- `__module__` - Module name
- `__qualname__` - Qualified name
- `__annotations__` - Type hints
```

---

## Flash Card 4: Decorator with Arguments

### Front:
```
How do you create a decorator that accepts arguments?
```

### Back:
```
**Pattern: Three levels of nesting**

```python
# LEVEL 1: Arguments handler
def repeat(times):
    # LEVEL 2: Decorator function
    def decorator(func):
        # LEVEL 3: Wrapper function
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            results = []
            for _ in range(times):
                result = func(*args, **kwargs)
                results.append(result)
            return results
        return wrapper
    return decorator

@repeat(times=3)
def greet(name):
    return f"Hello, {name}!"

print(greet("Alice"))  # ['Hello, Alice!', 'Hello, Alice!', 'Hello, Alice!']
```

**Breakdown:**
1. `repeat(3)` returns the `decorator` function
2. `@decorator` is applied to `greet`
3. Returns the `wrapper` function

**Pattern:** `@decorator_with_args(arg1, arg2)`
→ decorator_with_args returns decorator
→ decorator takes function
→ decorator returns wrapper
```

---

## Flash Card 5: Common Use Cases

### Front:
```
List 5 practical uses for decorators with examples
```

### Back:
```
**1. Logging**
```python
def log_calls(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__} with {args}, {kwargs}")
        return func(*args, **kwargs)
    return wrapper
```

**2. Timing**
```python
def timer(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        print(f"Took {time.time() - start:.4f}s")
        return result
    return wrapper
```

**3. Caching**
```python
def cache(func):
    cached = {}
    @functools.wraps(func)
    def wrapper(x):
        if x not in cached:
            cached[x] = func(x)
        return cached[x]
    return wrapper
```

**4. Authentication** (Web frameworks)
```python
def require_login(func):
    @functools.wraps(func)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            raise PermissionError("Login required")
        return func(request, *args, **kwargs)
    return wrapper
```

**5. Type Checking**
```python
def validate_int(func):
    @functools.wraps(func)
    def wrapper(x):
        if not isinstance(x, int):
            raise TypeError(f"Expected int, got {type(x).__name__}")
        return func(x)
    return wrapper
```
```

---

## Flash Card 6: Stacking Multiple Decorators

### Front:
```
How do multiple decorators interact when stacked?
```

### Back:
```
**Execution Order: BOTTOM TO TOP (when applying), but wrapping matters**

```python
def logger(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        print(f"Before {func.__name__}")
        result = func(*args, **kwargs)
        print(f"After {func.__name__}")
        return result
    return wrapper

def timer(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        import time
        start = time.time()
        result = func(*args, **kwargs)
        print(f"Took {time.time() - start:.4f}s")
        return result
    return wrapper

# This stacking:
@logger
@timer
def slow_function():
    time.sleep(1)
    return "done"

# Is equivalent to:
# slow_function = logger(timer(slow_function))
```

**Execution order:**
1. `logger` wraps `timer` which wraps `slow_function`
2. Calling `slow_function()` goes: logger → timer → original
3. Output order:
   ```
   Before slow_function
   Took 1.0001s
   After slow_function
   ```

**Key point:** Order matters! Different stacking order = different behavior
```

---

## Flash Card 7: Class-Based Decorators

### Front:
```
How do you write a decorator using a class?
```

### Back:
```
**Pattern: Implement `__call__` method**

```python
class Timer:
    def __init__(self, func):
        self.func = func
        self.elapsed = 0
    
    def __call__(self, *args, **kwargs):
        import time
        start = time.time()
        result = self.func(*args, **kwargs)
        self.elapsed = time.time() - start
        return result

@Timer
def calculate(x, y):
    return x + y

result = calculate(5, 3)
print(result)  # 8
print(calculate.elapsed)  # 0.00xxx
```

**Advantages of class-based decorators:**
- Can store state (like `elapsed` time)
- More readable for complex logic
- Can have multiple methods

**Disadvantages:**
- More boilerplate
- Slightly less "Pythonic" than functions
```

---

## How to Use These Cards

### Spaced Repetition Schedule:
- **Day 1:** Review cards 1-3 (core concepts)
- **Day 2:** Review all 7 cards
- **Day 3:** Review cards you got wrong
- **Day 7:** Final comprehensive review
- **Day 14:** Maintenance review

### Active Recall Practice:
1. Read the **Front** carefully
2. Say the answer out loud (don't just think it)
3. Flip to **Back** and compare
4. If wrong: Review immediately, then again in 10 minutes
5. If right: Mark as "Know" and move on

### Progression Test - You should be able to:
- ✅ Explain decorators in 60 seconds
- ✅ Write a basic decorator from memory in 2 minutes
- ✅ Automatically remember @functools.wraps
- ✅ Recognize when to use decorators in code
- ✅ Implement decorators with arguments
- ✅ Explain decorator stacking order
- ✅ Know class-based decorator pattern

---

## Quick Copy-Paste Guide

**To create a card:**
1. Go to your flashcard app
2. Click "Add Cards to Deck"
3. Copy the **Front** text into the Question field
4. Copy the **Back** text into the Answer field
5. Click "+ Add Card"
6. Repeat for remaining cards

**Tips:**
- Use the preview button to see formatted result
- Code blocks will display with syntax highlighting
- Bold (`**text**`) and italic (`*text*`) work automatically
- Lists automatically format with bullets or numbers

---

## Practice Exercises

After learning these cards, try:

1. **Write from scratch:** Implement a decorator without looking
2. **Modify:** Take a simple function and add a timing decorator
3. **Combine:** Stack two decorators (timer + logger)
4. **Debug:** Fix a decorator that forgot `@functools.wraps`
5. **Apply:** Use decorators in a real Flask or Django project

---

**Start your decorator mastery now! 🚀📚**

Access your flashcards at: `https://seenivasan.me/flashcards/`
