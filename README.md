# Rocketsim
A simple JS rocket game with an emphasis on realistic physics.
Play it live [here](https://camelpilot33.github.io/rocketsim/).

## How it Works
 - Collect the shiny orbs using your rocket
 - Controls are `W`/`S` to control thrust, `A`/`D` to control thruster angle
 - You start with 9L of fuel (equivalent to 9kg), gradually decreasing proportionally to the thrust. The unfueled rocket is 1kg. The same thrust will get you a greater amount of acceleration over time
 - The rocket has two parts: the main body and the thruster. The center of mass is the center of the main body. You can rotate the rocket by performing a burn with a non-zero angle, although it is hard to recover if your rocket tips too far.
 - If you are having trouble, try to balance the rocket like an [inverted pendulum](https://en.wikipedia.org/wiki/Inverted_pendulum).
 - You can use the walls to bounce, and land on the ground (only if you are going <10m/s)

## Current physics:
### Variables
| Variable    | Description       |
| ----------- | ----------------- |
| $\phi$      | Thruster angle    |
| $T$         | Thrust            |
| $\theta$    | Rocket angle      |
| $(x,y)$     | Position          |
| $l$         | Rocket length     |
| $I$         | Moment of inertia |
| $m$         | mass              |

### Frame Update
 - Checks bounding boxes
 - Takes inputs $\dot{\phi}$ and $\dot{T}$
 - Updates rocket fuel & mass
 - Solves these using [Euler Method](https://en.wikipedia.org/wiki/Euler_method) for solving differential equations:
$$\ddot{\theta}=\dfrac{T\\,l\tan(\phi)}{I}$$
$$\ddot{x}=-\frac{TI}M\sin(\theta+\phi)$$
$$\ddot{y}=g-\frac{TI}M\cos(\theta+\phi)$$
 - Render debug info & canvas
