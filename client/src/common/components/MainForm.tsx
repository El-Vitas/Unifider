import BtnPrimary from "./BtnPrimary";

type MainFormProps = {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  submitButtonText?: string;
};

const MainForm = ({
  children,
  onSubmit,
  submitButtonText = 'Guardar',
}: MainFormProps) => {
  return (
    <div className="flex justify-center items-center w-full">
      <form
        className="flex flex-col w-full max-w-3xl p-4 px-4 m-2 mt-4 space-y-4 bg-white rounded-lg shadow"
        onSubmit={onSubmit}
      >
        {children}

        <BtnPrimary as="button" type="submit" className='self-end'>
          {submitButtonText}
        </BtnPrimary>
      </form>
    </div>
  );
};

export default MainForm;
