import ImageCard from "../../../components/image-card/imageCard";
import { useNavigate } from "react-router-dom";
import SectionContent, {
  SectionTitle,
  SectionWrapper,
} from "../../../components/section-content/sectionContent";

export default function DispersalType() {
  const navigate = useNavigate();
  function redirectToTaggedDispersal() {
    navigate("/disperse");
  }

  function redirectToUnTaggedDispersal() {
    navigate("/disperse-non-eartag");
  }

  return (
    <SectionContent className="bg-light-background">
      <SectionTitle>
        <h1 className="text-3xl font-bold p-4">Dispersal Type</h1>
        <p className="p-4">Select your preferred dispersal actions.</p>
      </SectionTitle>
      <SectionWrapper className="flex flex-col gap-4 lg:flex-row lg:gap-4">
        <ImageCard
          className="w-full lg:w-1/2"
          imageLink="https://scontent.fmnl13-1.fna.fbcdn.net/v/t39.30808-6/375861214_617688323871501_8578582255957898112_n.jpg?stp=cp6_dst-jpg&_nc_cat=102&ccb=1-7&_nc_sid=49d041&_nc_eui2=AeHnFmG36y9uu0KSfqBZZUXhoQf8tmawSNShB_y2ZrBI1LCREV06hYGzg8Kmm4x0dDqf_DNYdtyehFQoMBBOaEq_&_nc_ohc=iTpi5FtUvrQAX9Lb1vn&_nc_ht=scontent.fmnl13-1.fna&oh=00_AfAgri5gYEcxc6X8p_onKe2WHJwiAR_aHDIZXtuITqCHJQ&oe=65117B4D"
          title="Ear-Tagged Livestock"
          description="Cattle, Swine , Goat"
          onClick={redirectToTaggedDispersal}
        />
        <ImageCard
          className="w-full lg:w-1/2"
          imageLink="https://www.cornucopia.org/wp-content/uploads/2021/06/OLPP4.jpg"
          title="Non Ear-Tagged Livestock."
          description="Free range chickens, Broiler Chicken."
          onClick={redirectToUnTaggedDispersal}
        />
      </SectionWrapper>
    </SectionContent>
  );
}
