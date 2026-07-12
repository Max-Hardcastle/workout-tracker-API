import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import WorkoutList from "./WorkoutList";
import { test, expect, vi } from "vitest";


test("renders workout dates", () => {
    render(
        <WorkoutList

            workouts={[
                {
                    id: 1,
                    workout_date: "2026-07-12",
                },

                {
                    id: 2,
                    workout_date: "2025-06-13",
                }
            ]}

            deleteWorkout={() => {}}
            setSelectedWorkoutId={() => {}}
        />
    )

    expect(screen.getByText("Workout: 2026-07-12")).toBeInTheDocument();
    expect(screen.getByText("Workout: 2025-06-13")).toBeInTheDocument();
});


//Mock function for deleting workouts
const deleteWorkout = vi.fn();

test("Delete button calls deleteWorkout with the correct ID", async () => {
    render(
        <WorkoutList

            workouts={[
                {
                    id: 0,
                    workout_date: "2026-07-12",
                }
            ]}

            deleteWorkout={deleteWorkout}
            setSelectedWorkoutId={() => {}}
        />
    )

    //Find and click button
    const button = screen.getByText("Delete");
    await userEvent.click(button);
    expect(deleteWorkout).toHaveBeenCalledWith(0);
});


//Mock function for editing workouts
const editWorkout = vi.fn();

test("Edit/View button calls setSelectedWorkoutId with the correct ID", async () => {
    render(
        <WorkoutList

            workouts={[
                {
                    id: 0,
                    workout_date: "2026-07-12",
                }
            ]}

            deleteWorkout={() => {}}
            setSelectedWorkoutId={editWorkout}
        />
    )

    //Find and click button
    const button = screen.getByText("Edit/View");
    await userEvent.click(button);
    expect(editWorkout).toHaveBeenCalledWith(0);
});