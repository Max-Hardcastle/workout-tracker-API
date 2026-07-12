import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import SetList from "./SetList";
import { test, expect, vi } from "vitest";


test("renders sets", () => {
    render(
        <SetList

            workoutDate="2026-07-12"

            sets={[
                {
                    "id": 1,
                    "workout_id": 1,
                    "exercise_id": 1,
                    "set_number": 1,
                    "reps": 10,
                    "weight": 20
                },

                {
                    "id": 2,
                    "workout_id": 1,
                    "exercise_id": 1,
                    "set_number": 2,
                    "reps": 9,
                    "weight": 20
                },

                {
                    "id": 3,
                    "workout_id": 1,
                    "exercise_id": 2,
                    "set_number": 1,
                    "reps": 5,
                    "weight": 50
                },
            ]}

            exercises={[
                {
                    id: 1,
                    name: "Bench Press",
                    description: "Chest Exercise"
                },

                {
                    id: 2,
                    name: "Squat",
                    description: "Leg Pressing Exercise"
                },
            ]}

            deleteSet={() => {}}
            selectedSetId={null}
            setSelectedSetId={() => {}}
            editReps={""}
            setEditReps={() => {}}
            editWeight={""}
            setEditWeight={() => {}}
            updateSet={() => {}}
        />
    )

    expect(screen.getByText("Bench Press: 10 reps at 20kg")).toBeInTheDocument();
    expect(screen.getByText("Bench Press: 9 reps at 20kg")).toBeInTheDocument();
    expect(screen.getByText("Squat: 5 reps at 50kg")).toBeInTheDocument();
});


//Mock function for deleting sets
const deleteSet = vi.fn();

test("Delete button calls deleteSet with the correct ID", async () => {
    render(
        <SetList

            workoutDate="2026-07-12"

            sets={[
                {
                    "id": 1,
                    "workout_id": 1,
                    "exercise_id": 1,
                    "set_number": 1,
                    "reps": 10,
                    "weight": 20
                }
            ]}

            exercises={[
                {
                    id: 1,
                    name: "Bench Press",
                    description: "Chest Exercise"
                }
            ]}

            deleteSet={deleteSet}
            selectedSetId={null}
            setSelectedSetId={() => {}}
            editReps={""}
            setEditReps={() => {}}
            editWeight={""}
            setEditWeight={() => {}}
            updateSet={() => {}}
        />
    )

    //Find and click button
    const button = screen.getByText("Delete");
    await userEvent.click(button);
    expect(deleteSet).toHaveBeenCalledWith(1,1);
});


//Mock function for editing sets
const editSet = vi.fn();

test("Edit button calls setSelectedSetID with the correct ID", async () => {
    render(
        <SetList

            workoutDate="2026-07-12"

            sets={[
                {
                    "id": 1,
                    "workout_id": 1,
                    "exercise_id": 1,
                    "set_number": 1,
                    "reps": 10,
                    "weight": 20
                }
            ]}

            exercises={[
                {
                    id: 1,
                    name: "Bench Press",
                    description: "Chest Exercise"
                }
            ]}

            deleteSet={() => {}}
            selectedSetId={null}
            setSelectedSetId={editSet}
            editReps={""}
            setEditReps={() => {}}
            editWeight={""}
            setEditWeight={() => {}}
            updateSet={() => {}}
        />
    )

    //Find and click button
    const button = screen.getByText("Edit");
    await userEvent.click(button);
    expect(editSet).toHaveBeenCalledWith(1);
});