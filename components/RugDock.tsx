"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * The bar that stays at the foot of the screen once the order panel has
 * scrolled away — benirugs.com's own move: the rug's name, what has been
 * chosen, and the same action with the same price, plus a way back up to the
 * choices. It appears only after `#rug-order` has left the screen, so it is
 * never a second copy of something already in view.
 */
export default function RugDock({
  name,
  detail,
  editLabel,
  children,
}: {
  name: string;
  detail?: string;
  editLabel: string;
  children: ReactNode;
}) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      const panel = document.getElementById("rug-order");
      if (!panel) return;
      const r = panel.getBoundingClientRect();
      setOn(r.bottom < 0);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className={`rug-dock${on ? " is-on" : ""}`} aria-hidden={!on} inert={!on}>
      <div className="rug-dock-said">
        <p className="display d-3 rug-dock-name">{name}</p>
        {detail && <p className="label rug-dock-detail">{detail}</p>}
      </div>
      <div className="rug-dock-action">{children}</div>
      <a href="#rug-order" className="label rug-dock-edit">
        {editLabel}
      </a>
    </div>
  );
}
