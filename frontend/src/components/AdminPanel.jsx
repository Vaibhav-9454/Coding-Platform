import {useForm, useFieldArray} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {z} from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router';

//Zod schema matching the problem schema
const problemSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
    visibleTestCases: z.array(
        z.object({
            input: z.string().min(1, 'Input is required'),
            output: z.string().min(1, 'Output is required'),
            explanation: z.string().min(1, 'Explanation is required')

        })
    ).min(1, 'At least one visible test case required'),
    hiddenTestCases: z.array(
        z.object({
            input: z.string().min(1, 'Input is required'),
            output: z.string().min(1, 'Output is required')
        })
    ).min(1, 'At least one hidden test case required'),
    startCode: z.array(
        z.object({
            language: z.enum(['C++', 'Java', 'JavaScript']),
            completeCode: z.string().min(1, 'Complete Code is required')
        })
    ).length(3, 'All three languages required')
    

});

function AdminPanel() {

  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      visibleTestCases: [{ input: "", output: "", explanation: "" }],
      hiddenTestCases: [{ input: "", output: "" }],
      startCode: [
        { language: "C++", initialCode: "" },
        { language: "Java", initialCode: "" },
        { language: "JavaScript", initialCode: "" }
      ],
      referenceSolution: [
        { language: "C++", completeCode: "" },
        { language: "Java", completeCode: "" },
        { language: "JavaScript", completeCode: "" }
      ]
    }
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible
  } = useFieldArray({
    control,
    name: "visibleTestCases"
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden
  } = useFieldArray({
    control,
    name: "hiddenTestCases"
  });

  const onSubmit = async (data) => {
    try {

      await axiosClient.post("/problem/create", data);

      alert("Problem created successfully");

      navigate("/");

    } catch (error) {

      alert(error?.response?.data?.message || error.message);

    }
  };

  return (

    <div className="container mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">Create New Problem</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Title */}
        <input
          {...register("title")}
          placeholder="Title"
          className="input input-bordered w-full"
        />

        {/* Description */}
        <textarea
          {...register("description")}
          placeholder="Description"
          className="textarea textarea-bordered w-full"
        />

        {/* Difficulty */}
        <select
          {...register("difficulty")}
          className="select select-bordered w-full"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        {/* Tags */}
        <select
          {...register("tags")}
          className="select select-bordered w-full"
        >
          <option value="array">Array</option>
          <option value="linkedList">Linked List</option>
          <option value="graph">Graph</option>
          <option value="dp">DP</option>
        </select>

        {/* Visible Test Cases */}
        <div>

          <h2 className="font-semibold">Visible Test Cases</h2>

          <button
            type="button"
            onClick={() => appendVisible({ input: "", output: "", explanation: "" })}
            className="btn btn-sm btn-primary"
          >
            Add Visible Case
          </button>

          {visibleFields.map((field, index) => (

            <div key={field.id} className="border p-4 rounded-lg space-y-2">

              <button
                type="button"
                onClick={() => removeVisible(index)}
                className="btn btn-xs btn-error"
              >
                Remove
              </button>

              <input
                {...register(`visibleTestCases.${index}.input`)}
                placeholder="Input"
                className="input input-bordered w-full"
              />

              <input
                {...register(`visibleTestCases.${index}.output`)}
                placeholder="Output"
                className="input input-bordered w-full"
              />

              <textarea
                {...register(`visibleTestCases.${index}.explanation`)}
                placeholder="Explanation"
                className="textarea textarea-bordered w-full"
              />

            </div>

          ))}

        </div>

        {/* Hidden Test Cases */}
        <div>

          <h2 className="font-semibold">Hidden Test Cases</h2>

          <button
            type="button"
            onClick={() => appendHidden({ input: "", output: "" })}
            className="btn btn-sm btn-primary"
          >
            Add Hidden Case
          </button>

          {hiddenFields.map((field, index) => (

            <div key={field.id} className="border p-4 rounded-lg space-y-2">

              <button
                type="button"
                onClick={() => removeHidden(index)}
                className="btn btn-xs btn-error"
              >
                Remove
              </button>

              <input
                {...register(`hiddenTestCases.${index}.input`)}
                placeholder="Input"
                className="input input-bordered w-full"
              />

              <input
                {...register(`hiddenTestCases.${index}.output`)}
                placeholder="Output"
                className="input input-bordered w-full"
              />

            </div>

          ))}

        </div>

        {/* Starter Code */}
        <div>

          <h2 className="font-semibold">Starter Code</h2>

          {[0, 1, 2].map((index) => (

            <div key={index} className="space-y-2">

              <h3>
                {index === 0 ? "C++" : index === 1 ? "Java" : "JavaScript"}
              </h3>

              <textarea
                {...register(`startCode.${index}.initialCode`)}
                rows={6}
                className="textarea textarea-bordered w-full"
              />

            </div>

          ))}

        </div>

        {/* Reference Solution */}
        <div>

          <h2 className="font-semibold">Reference Solution</h2>

          {[0, 1, 2].map((index) => (

            <div key={index} className="space-y-2">

              <h3>
                {index === 0 ? "C++" : index === 1 ? "Java" : "JavaScript"}
              </h3>

              <textarea
                {...register(`referenceSolution.${index}.completeCode`)}
                rows={6}
                className="textarea textarea-bordered w-full"
              />

            </div>

          ))}

        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
        >
          Create Problem
        </button>

      </form>

    </div>
  );
}

export default AdminPanel;