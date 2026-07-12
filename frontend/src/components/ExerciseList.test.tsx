import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import ExerciseList from "./ExerciseList";
import { test, expect, vi } from "vitest";


test("renders exercise names", () => {
    render(
        <ExerciseList

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
                }
            ]}

            deleteExercise={() => {}}

            selectedExerciseId={null}
            setSelectedExerciseId={() => {}}

            editExerciseName=""
            setEditExerciseName={() => {}}

            editExerciseDescription=""
            setEditExerciseDescription={() => {}}

            updateExercise={() => {}}
        />
    )

    expect(screen.getByText("Bench Press")).toBeInTheDocument();
    expect(screen.getByText("Squat")).toBeInTheDocument();
});


//Mock function for deleting exercises
const deleteExercise = vi.fn();

test("Delete button calls deleteExercise with the correct ID", async () => {
    render(
        <ExerciseList

            exercises={[
                {
                    id: 1,
                    name: "Bench Press",
                    description: "Chest Exercise"
                },
            ]}

            deleteExercise={deleteExercise}

            selectedExerciseId={null}
            setSelectedExerciseId={() => {}}

            editExerciseName=""
            setEditExerciseName={() => {}}

            editExerciseDescription=""
            setEditExerciseDescription={() => {}}

            updateExercise={() => {}}
        />
    )

    //Find and click button
    const button = screen.getByText("Delete");
    await userEvent.click(button);
    expect(deleteExercise).toHaveBeenCalledWith(1);
});


//Mock function for deleting exercises
const editExercise = vi.fn();

test("Edit button calls setSelectedExerciseId with the correct ID", async () => {
    render(
        <ExerciseList

            exercises={[
                {
                    id: 1,
                    name: "Bench Press",
                    description: "Chest Exercise"
                },
            ]}

            deleteExercise={() => {}}

            selectedExerciseId={null}
            setSelectedExerciseId={editExercise}

            editExerciseName=""
            setEditExerciseName={() => {}}

            editExerciseDescription=""
            setEditExerciseDescription={() => {}}

            updateExercise={() => {}}
        />
    )

    //Find and click button
    const button = screen.getByText("Edit");
    await userEvent.click(button);
    expect(editExercise).toHaveBeenCalledWith(1);
});