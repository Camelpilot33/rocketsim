# Rocketsim
A simple JS rocket simulator/game\
View live [here](https://camelpilot33.github.io/rocketsim/)

## How it works
 - Collect the shiny orbs using your rocket
 - Controls are `W`/`S` to control thrust, `A`/`D` to control thruster angle
 - You start with 9L of fuel (equivalent to 9kg), gradually decreasing proportionally to the thrust. The unfueled rocket is 1kg. The same thrust will get you a greater amount of acceleration over time
 - The rocket has two parts: the main body and the thruster. The center of mass is the center of the main body. You can rotate the rocket by performing a burn with a non-zero angle, although it is hard to recover if your rocket tips too far.
 - The main strategy is trying to balance the rocket like an [inverted pendulum](https://en.wikipedia.org/wiki/Inverted_pendulum).
 - You can use the walls to bounce, and land on the ground (only if you are going <10m/s)

## Current physics:
### Variables
 - Thruster angle $\phi$
 - Thrust $T$
 - Rocket angle $\theta$
 - Position $(x,y)$
 - Rocket length $l$
 - Various moments of inertia $I$
 - Changing mass $m$
### Process
 - Checks bounding boxes
 - Takes inputs $\dot{\phi}$ and $\dot{T}$
 - Updates rocket fuel & mass
 - Solves these using [Euler Method](https://en.wikipedia.org/wiki/Euler_method) for solving differential equations:
$$\ddot{\theta}=\dfrac{T\\,l\tan(\phi)}{I}$$
$$\ddot{x}=-\frac{TI}M\sin(\theta+\phi)$$
$$\ddot{y}=g-\frac{TI}M\cos(\theta+\phi)$$
 - Render debug info & canvas
