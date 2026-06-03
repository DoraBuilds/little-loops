import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { ChildSelector } from "@/components/ChildSelector";
import type { Child } from "@/lib/types";

const children: Child[] = [
  {
    id: "child-1",
    name: "Lily",
    age: 5,
    ageBucket: "4-6",
    avatarAnimal: "bunny",
    schedule: {
      morning: { start: "07:00", end: "09:00" },
      evening: { start: "17:00", end: "20:00" },
    },
    morning: [],
    evening: [],
  },
];

describe("ChildSelector parent gate", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const renderSelector = (props?: Partial<Parameters<typeof ChildSelector>[0]>) =>
    render(
      <ChildSelector
        children={children}
        globalTheme="free"
        homeScene="bike"
        dueRoutineByChild={{ "child-1": null }}
        onSelectChild={() => {}}
        onOpenSettings={() => {}}
        {...props}
      />
    );

  it("does not open settings on a quick press", () => {
    const onOpenSettings = vi.fn();

    renderSelector({ onOpenSettings });

    const button = screen.getByRole("button", {
      name: "Press and hold to open Parent Settings",
    });

    fireEvent.pointerDown(button);
    act(() => {
      vi.advanceTimersByTime(400);
    });
    fireEvent.pointerUp(button);

    expect(onOpenSettings).not.toHaveBeenCalled();
  });

  it("opens settings after a full hold", () => {
    const onOpenSettings = vi.fn();

    renderSelector({ onOpenSettings });

    const button = screen.getByRole("button", {
      name: "Press and hold to open Parent Settings",
    });

    fireEvent.pointerDown(button);
    act(() => {
      vi.advanceTimersByTime(1250);
    });

    expect(onOpenSettings).toHaveBeenCalledTimes(1);
  });

  it("signals when a morning routine is ready", () => {
    renderSelector({
      globalTheme: "morning",
      dueRoutineByChild: { "child-1": "morning" },
    });

    expect(screen.getByRole("heading", { name: "Morning routine time" })).toBeInTheDocument();
    expect(screen.getByText("The sun is up and morning routines are ready.")).toBeInTheDocument();
    expect(screen.getByText("Morning jobs are ready now")).toBeInTheDocument();
    expect(screen.getByText(/morning routine ready/i)).toBeInTheDocument();
    expect(screen.getByText("Tap to start now")).toBeInTheDocument();
  });

  it("signals when an evening routine is ready", () => {
    renderSelector({
      globalTheme: "evening",
      dueRoutineByChild: { "child-1": "evening" },
    });

    expect(screen.getByRole("heading", { name: "Evening routine time" })).toBeInTheDocument();
    expect(screen.getByText("The stars are out and bedtime routines are ready.")).toBeInTheDocument();
    expect(screen.getByText("Evening jobs are ready now")).toBeInTheDocument();
    expect(screen.getByText(/evening routine ready/i)).toBeInTheDocument();
    expect(screen.getByText("Tap to start now")).toBeInTheDocument();
  });

  it("keeps the home screen friendly when no routine is due", () => {
    renderSelector({
      globalTheme: "free",
      dueRoutineByChild: { "child-1": null },
    });

    expect(screen.getByRole("heading", { name: "Little Loops" })).toBeInTheDocument();
    expect(screen.getByText("Who is ready to shine today?")).toBeInTheDocument();
    expect(screen.getByText("No routine is due right now")).toBeInTheDocument();
    expect(screen.getByText("Choose a child to play, explore, or check in later.")).toBeInTheDocument();
    expect(screen.getByText("Tap to check in anyway")).toBeInTheDocument();
  });
});
